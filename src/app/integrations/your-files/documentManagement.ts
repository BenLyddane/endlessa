"use server";
import { createClient } from "@/utils/supabase/server";

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url: string;
  userId: string;
  path: string;
}

export const uploadFiles = async (files: File[]): Promise<UploadedDocument[]> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Could not get user details");

  const outerFolderPath = `${user.id}`;
  const uploadedDocuments: UploadedDocument[] = [];

  for (const file of files) {
    const fileUploadDate = new Date().toISOString();
    let filePath;

    if (file.webkitRelativePath || file.mozFullPath || file.path) {
      const relativePath = file.webkitRelativePath || file.mozFullPath || file.path;
      const folderPath = relativePath.split(/[\\/]/).slice(0, -1).join("/");
      const fileName = relativePath.split(/[\\/]/).pop() || "";
      filePath = `${outerFolderPath}/${folderPath}/${fileName}`;
    } else {
      filePath = `${outerFolderPath}/${file.name}`;
    }

    console.log("File path before upload:", filePath);

    const { data, error } = await supabase.storage
      .from("local_files")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      continue;
    } else {
      console.log("File uploaded successfully to:", data.path);
    }

    const { data: publicUrlData } = supabase.storage
      .from("local_files")
      .getPublicUrl(data.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Error getting public URL");
      continue;
    }

    const publicURL = publicUrlData.publicUrl;
    const fileType = file.type === "" ? "folder" : "file";

    const { data: insertData, error: insertError } = await supabase
      .from("user_files")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: fileType,
        file_url: publicURL,
        file_path: filePath,
      })
      .select("id");

    if (insertError) {
      console.error("Error inserting file metadata:", insertError);
      continue;
    }

    console.log("File metadata inserted successfully");

    if (!insertData || insertData.length === 0) {
      console.error("Error retrieving inserted file metadata");
      continue;
    }

    const insertedFileId = insertData[0].id;

    uploadedDocuments.push({
      id: insertedFileId,
      name: file.name,
      type: fileType,
      uploadedAt: fileUploadDate,
      url: publicURL,
      userId: user.id,
      path: filePath,
    });
  }

  return uploadedDocuments;
};

export const getUploadedDocuments = async (): Promise<UploadedDocument[]> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Could not get user details");

  const { data, error } = await supabase
    .from("user_files")
    .select("id, file_name, file_type, uploaded_at, file_url, file_path")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching uploaded documents:", error);
    return [];
  }

  return data.map((document) => ({
    id: document.id,
    name: document.file_name,
    type: document.file_type,
    uploadedAt: document.uploaded_at,
    url: document.file_url,
    userId: user.id,
    path: document.file_path,
  }));
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  const supabase = createClient();

  // Fetch the document's path before deleting
  const { data: docData, error: docError } = await supabase
    .from("user_files")
    .select("file_path")
    .eq("id", documentId)
    .single();

  if (docError || !docData) {
    console.error("Error fetching document path:", docError);
    throw new Error("Document not found or path retrieval failed");
  }

  // Delete the file from storage
  const { error: storageError } = await supabase
    .storage
    .from("local_files")
    .remove([docData.file_path]);

  if (storageError) {
    console.error("Error deleting file from storage:", storageError);
    throw new Error("File deletion failed");
  }

  // Delete the document metadata from the database
  const { error: deleteError } = await supabase
    .from("user_files")
    .delete()
    .match({ id: documentId });

  if (deleteError) {
    console.error("Error deleting document metadata:", deleteError);
    throw new Error("Metadata deletion failed");
  }
};

export const createFolder = async (folderPath: string): Promise<void> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Could not get user details");

  const fullFolderPath = `${user.id}/${folderPath}`;

  // Create a folder in Supabase storage
  const { error: createFolderError } = await supabase.storage
    .from("local_files")
    .createFolder(fullFolderPath);

  if (createFolderError) {
    console.error("Error creating folder in Supabase storage:", createFolderError);
    throw new Error("Folder creation failed");
  }

  // Insert folder metadata into the database
  const folderName = folderPath.split("/").pop() || "";
  const { error: insertError } = await supabase.from("user_files").insert({
    user_id: user.id,
    file_name: folderName,
    file_type: "folder",
    uploaded_at: new Date().toISOString(),
    file_url: "",
    file_path: fullFolderPath,
  });

  if (insertError) {
    console.error("Error inserting folder metadata:", insertError);
    throw new Error("Folder metadata insertion failed");
  }
};