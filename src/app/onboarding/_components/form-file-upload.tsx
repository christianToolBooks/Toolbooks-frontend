// components/form-file-upload.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { FormField } from "./form-field";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils/utils";
import Image from "next/image";

interface FormFileUploadProps {
  label: string;
  name: string;
  /** URL almacenada en el form (o null) */
  value: string | null;
  /** Guarda la URL en el form */
  onChange: (url: string | null) => void;
  /** Sube a S3 y devuelve la URL pública */
  onUpload: (file: File) => Promise<string>;
  accept?: string;
  required?: boolean;
  error?: string;
  className?: string;
  description?: string;
  maxSize?: number; // MB
  disabled?: boolean;
}

export function FormFileUpload({
  label,
  name,
  value,
  onChange,
  onUpload,
  accept = "image/*",
  required = false,
  error,
  className,
  description,
  maxSize = 5,
  disabled = false,
}: FormFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`The file is very large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max ${maxSize}MB`);
      return;
    }

    // preview local mientras sube
    if (file.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = e => setPreview(e.target?.result as string);
      r.readAsDataURL(file);
    }

    try {
      setUploading(true);
      const url = await onUpload(file);   // ← SUBE A S3
      onChange(url);                      
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      console.error(e);
      alert("Error uploading file");
      setPreview(null);
      onChange(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const shownImage = preview ?? value ?? null;

  return (
    <FormField label={label} required={required} error={error} className={className} description={description}>
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {!shownImage ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className={cn(
              "w-full h-32 border-2 border-dashed border-border hover:border-primary",
              "flex flex-col items-center justify-center gap-2",
              error && "border-destructive"
            )}
          >
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">
              {isUploading ? "Uploading…" : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-muted-foreground">Max size: {maxSize}MB</span>
          </Button>
        ) : (
          <div className="relative">
            <div className="relative w-48 h-32 border border-border rounded-lg overflow-hidden">
              <Image
                height={128}
                width={192}
                src={shownImage || "/placeholder.svg"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 h-6 w-6 p-0"
                disabled={disabled || isUploading}
                title="Remove"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
}
