"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Home from "@/components/ui/home";
interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

const DocumentPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Function to handle document upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Upload the file to Supabase storage
      // TODO: Extract data from the document using pdfjs or appropriate library
      // TODO: Generate embeddings from the extracted data
      // TODO: Update the documents state with the new document and metadata
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Home />
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input type="file" onChange={handleUpload} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.uploadedAt}</TableCell>
                  <TableCell>
                    <Button variant="outline">View</Button>
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
