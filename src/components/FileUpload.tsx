"use client";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  // Props used by AuthForm
  type?: string;
  accept?: string;
  placeholder?: string;
  folder?: string;
  variant?: string;
  onFileChange?: (url: string) => void;
}

const ImageUpload = ({
  onUploadComplete,
  onUploadError,
  onFileChange,
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          const uploadedFileUrl = res[0].ufsUrl;
          setImageUrl(uploadedFileUrl);
          toast.success("Upload Completed");
          if (onUploadComplete) {
            onUploadComplete(uploadedFileUrl);
          }
          if (onFileChange) {
            onFileChange(uploadedFileUrl);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
          if (onUploadError) {
            onUploadError(error);
          }
        }}
      />
      {imageUrl && (
        <Image src={imageUrl} alt="id card" height={400} width={400} />
      )}
    </div>
  );
};

export default ImageUpload;
