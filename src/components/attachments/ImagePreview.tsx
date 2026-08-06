import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface ImagePreviewProps {
  url: string;
  fileName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreview({ url, fileName, open, onOpenChange }: ImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-1 overflow-hidden bg-black/90 border-black shadow-2xl">
        <DialogHeader className="absolute top-2 left-4 z-10">
          <DialogTitle className="text-white drop-shadow-md">{fileName}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[70vh] flex items-center justify-center pt-8">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={url} 
              alt={fileName}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
