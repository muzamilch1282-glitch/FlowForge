import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PdfPreviewProps {
  url: string;
  fileName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfPreview({ url, fileName, open, onOpenChange }: PdfPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b shrink-0 bg-muted/30">
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full bg-muted/10 relative">
          {url && (
            <iframe 
              src={`${url}#toolbar=0`} 
              className="absolute inset-0 w-full h-full border-0"
              title={fileName}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
