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
} from "@/app/integrations/documents/documentManagement";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FaTrashAlt, FaFileAlt, FaFolder } from "react-icons/fa";

const DocumentPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploadedDocuments();
  }, []);

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
      if (uploadedDocs.length === 0) {
        throw new Error("No files were uploaded. Please try again.");
      }

      toast({
        title: "Files uploaded successfully",
        description: `${uploadedDocs.length} file(s) uploaded.`,
        variant: "default",
      });
      setSelectedFiles([]);
      fetchUploadedDocuments();
    } catch (error: any) {
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

  const renderFileIcon = (type: string) => {
    if (type === "folder") {
      return <FaFolder className="text-xl" />;
    } else {
      return <FaFileAlt className="text-xl" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-background text-foreground shadow-md mb-8">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="fileUpload" className="block mb-2">
                Select Files or Folders:
              </label>
              <Input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="border border-border mb-4"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-background text-foreground shadow-md">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{renderFileIcon(document.type)}</TableCell>
                  <TableCell>
                    {new Date(document.uploadedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteDocument(document)}
                    >
                      <FaTrashAlt className="text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPage;
