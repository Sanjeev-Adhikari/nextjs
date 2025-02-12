import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <div className="flex justify-end p-2 absolute right-2 top-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <iframe
          src={ `${pdfUrl}#toolbar=0`}
          className="w-full h-full rounded-lg"
          title="PDF Viewer"
        />
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;