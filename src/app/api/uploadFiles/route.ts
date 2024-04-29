import { NextResponse } from "next/server";
import { uploadFiles } from "@/app/integrations/documents/documentManagement";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploadedDocs = await uploadFiles(files);
    return NextResponse.json(uploadedDocs);
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Error uploading files", message: error.message }, { status: 500 });
  }
}