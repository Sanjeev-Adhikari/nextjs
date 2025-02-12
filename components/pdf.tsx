import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const PDFViewer = ({
  isOpen,
  onClose,
  pdfUrl
}: {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}) => {
  // Transform Cloudinary URL to ensure inline viewing
  const transformedPdfUrl = pdfUrl
    ? pdfUrl.replace('/upload/', '/upload/fl_attachment/')
    : '';

  // Create Google Docs viewer URL
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(transformedPdfUrl)}&embedded=true`;
  console.log(googleDocsUrl)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[90vw] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">PDF Viewer</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 w-full h-full min-h-0">
            <iframe
              src={googleDocsUrl}
              className="w-full h-full border-none"
              title="PDF Viewer"
              frameBorder="0"
            />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PDFViewer;