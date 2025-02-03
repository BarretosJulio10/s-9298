import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  imageUrl?: string;
}

export function ImageUpload({ onUpload, imageUrl }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await onUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Template"
            className="max-h-48 mx-auto rounded-lg"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onUpload(new File([], ""))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="py-8">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">
            Arraste uma imagem ou clique para selecionar
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <span>Selecionar Imagem</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}