"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  UploadedDocument,
  getUploadedDocuments,
  deleteDocument,
  createFolder,
} from "@/app/integrations/your-files/documentManagement";
import { FaTrashAlt, FaFileAlt, FaFolder, FaFolderPlus } from "react-icons/fa";
import Home from "@/components/ui/home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children: FileTreeNode[];
  document?: UploadedDocument;
}

const DocumentPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [parentPath, setParentPath] = useState<string>("");

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };

    fetchUserId();
    fetchUploadedDocuments();
  }, []);

  useEffect(() => {
    const tree = buildFileTree(uploadedDocuments);
    setFileTree(tree);
  }, [uploadedDocuments]);

  const fetchUploadedDocuments = async () => {
    try {
      const documents = await getUploadedDocuments();
      setUploadedDocuments(documents);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error fetching uploaded documents",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    const formData = new FormData(event.currentTarget);

    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    for (const file of selectedFolder) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/uploadFiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`${errorResponse.error}: ${errorResponse.message}`);
      }

      const uploadedDocs = await response.json();
      console.log("Uploaded documents:", uploadedDocs);

      if (uploadedDocs.length === 0) {
        throw new Error("No files were uploaded. Please try again.");
      }

      toast({
        title: "Files uploaded successfully",
        description: `${uploadedDocs.length} file(s) uploaded.`,
        variant: "default",
      });
      setSelectedFiles([]);
      setSelectedFolder([]);
      fetchUploadedDocuments();
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error uploading files",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFolder(Array.from(event.target.files || []));
  };

  const handleDeleteDocument = async (document: UploadedDocument) => {
    try {
      await deleteDocument(document.id);
      toast({
        title: "Document deleted",
        description: `${document.name} has been deleted.`,
        variant: "default",
      });
      fetchUploadedDocuments();
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const buildFileTree = (documents: UploadedDocument[]): FileTreeNode[] => {
    const tree: FileTreeNode[] = [];

    documents.forEach((document) => {
      const pathParts = document.path.split("/").slice(1); // Exclude the user ID folder
      let currentLevel = tree;

      pathParts.forEach((part, index) => {
        const existingNode = currentLevel.find((node) => node.name === part);

        if (existingNode) {
          currentLevel = existingNode.children;
        } else {
          const isFolder =
            index !== pathParts.length - 1 || document.type === "folder";
          const newNode: FileTreeNode = {
            name: part,
            path: pathParts.slice(0, index + 1).join("/"),
            type: isFolder ? "folder" : "file",
            children: [],
          };

          if (!isFolder) {
            newNode.document = document;
          }

          currentLevel.push(newNode);
          currentLevel = newNode.children;
        }
      });
    });

    return tree;
  };

  const renderFileIcon = (type: string) => {
    if (type === "folder") {
      return <FaFolder className="text-xl" />;
    } else {
      return <FaFileAlt className="text-xl" />;
    }
  };

  const handleCreateFolder = async () => {
    if (folderName) {
      try {
        const folderPath = `${parentPath}/${folderName}`;
        await createFolder(folderPath);
        toast({
          title: "Folder created",
          description: `Folder "${folderName}" has been created.`,
          variant: "default",
        });
        setFolderName("");
        fetchUploadedDocuments();
      } catch (error: any) {
        toast({
          title: "Error creating folder",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const renderFileTree = (
    nodes: FileTreeNode[],
    currentPath: string,
    level: number = 0
  ) => {
    return (
      <Accordion type="single" collapsible>
        {nodes.map((node, index) => (
          <AccordionItem key={index} value={node.name}>
            <AccordionTrigger className={`pl-${level * 4}`}>
              <div className="flex items-center space-x-2">
                {renderFileIcon(node.type)}
                <span>{node.name}</span>
                {node.type === "folder" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="ml-2">
                        <FaFolderPlus className="text-xl" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Folder</DialogTitle>
                        <DialogDescription>
                          Enter the name of the new folder.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Folder name"
                      />
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            setParentPath(node.path);
                            handleCreateFolder();
                          }}
                        >
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {node.type === "folder" ? (
                renderFileTree(node.children, node.path, level + 1)
              ) : (
                <div className="flex items-center justify-between pl-4">
                  <a
                    href={node.document?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </a>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      node.document && handleDeleteDocument(node.document)
                    }
                  >
                    <FaTrashAlt className="text-red-500" />
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Home />
      <Card className="bg-background text-foreground shadow-md mb-8">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fileUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Files:
              </label>
              <div className="flex justify-start items-center gap-4">
                <label
                  htmlFor="fileUpload"
                  className="bg-white cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Choose Files
                </label>
                <div className="grow">
                  <input
                    id="fileUpload"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="block text-sm text-gray-500">
                    {selectedFiles.map((file) => file.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="folderUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Folder:
              </label>
              <div className="flex justify-start items-center gap-4">
                <label
                  htmlFor="folderUpload"
                  className="bg-white cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Choose Folder
                </label>
                <div className="grow">
                  <input
                    id="folderUpload"
                    type="file"
                    multiple
                    onChange={handleFolderSelect}
                    className="hidden"
                    webkitdirectory=""
                    directory=""
                  />
                  <span className="block text-sm text-gray-500">
                    {selectedFolder
                      .map((file) => file.webkitRelativePath || file.name)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="outline"
              className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              disabled={
                isUploading ||
                (selectedFiles.length === 0 && selectedFolder.length === 0)
              }
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-background text-foreground shadow-md">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>{renderFileTree(fileTree, "", 0)}</CardContent>
      </Card>
    </div>
  );
};

export default DocumentPage;
