
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

export default function LogoUpload({ label, value, onChange, description }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {value ? (
          <div className="text-center space-y-3">
            <div className="max-w-48 mx-auto">
              <img 
                src={typeof value === 'string' ? value : URL.createObjectURL(value)} 
                alt="Preview" 
                className="max-h-16 mx-auto object-contain"
              />
            </div>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Alterar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <Image className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG até 2MB
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
