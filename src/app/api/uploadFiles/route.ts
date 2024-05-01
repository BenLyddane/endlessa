import { NextResponse } from "next/server";
import { uploadFiles } from "@/app/integrations/your-files/documentManagement";

export async function POST(request: Request) {
  try {
    console.log("Received request to /api/uploadFiles");

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    console.log("Number of files received:", files.length);

    const uploadedDocs = await uploadFiles(files);
    console.log("Number of uploaded documents:", uploadedDocs.length);

    return NextResponse.json(uploadedDocs);
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Error uploading files", message: error.message },
      { status: 500 }
    );
  }
}