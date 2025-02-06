
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageFile: File | null;
  imageUrl: string;
  index: number;
  onImageChange: (index: number, file: File) => void;
}

export function ImagePreview({ imageFile, imageUrl, index, onImageChange }: ImagePreviewProps) {
  const hasImage = imageFile || imageUrl;

  const handleDeleteImage = () => {
    onImageChange(index, null as any);
  };

  return (
    <div className="w-full flex flex-col items-end mt-0">
      <div className="w-[35%]">
        <div className="flex justify-start gap-2 mb-4 mt-0">
          <input
            type="file"
            accept="image/*"
            id={`image-${index}`}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onImageChange(index, e.target.files[0]);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`image-${index}`)?.click()}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            {hasImage ? 'Trocar imagem' : 'Upload de imagem'}
          </Button>
        </div>

        <div className="aspect-w-4 aspect-h-3">
          {hasImage ? (
            <div className="relative">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
              {imageFile && (
                <span className="text-sm text-muted-foreground block mt-2">
                  {imageFile.name}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
              <ImagePlus className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {hasImage && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeleteImage}
            className="flex items-center gap-2 mt-4"
          >
            <Trash2 className="h-4 w-4" />
            Excluir imagem
          </Button>
        )}
      </div>
    </div>
  );
}
