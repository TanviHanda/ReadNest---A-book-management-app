"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { deleteUTFileAction } from "@/lib/actions/uploadthing";
import { UploadButton } from "@/lib/uploadthing";
import { utapi } from "@/lib/utapi";

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  // Props used by AuthForm
  type?: string;
  accept?: string;
  placeholder?: string;
  folder?: string;
  variant?: string;
  // preserves old signature
  onFileChange?: (url: string) => void;
  // new callback to forward selected File objects before upload
  onFilesChange?: (files: File[]) => void;
  value?: string | null;
  // whether to render a preview (image/video) on file select
  renderPreview?: boolean;
  // whether to render preview only after upload success (uses returned file url)
  previewOnUploadSuccess?: boolean;
  // expected upload type: 'image', 'video' or 'auto' (try to infer from file)
  uploadType?: "image" | "video" | "auto";
  // pass UploadButton endpoint (defaults to imageUploader for backward compat)
  endpoint?: keyof OurFileRouter;
}

const ImageUpload = ({
  onUploadComplete,
  onUploadError,
  onFileChange,
  onFilesChange,
  renderPreview = true,
  previewOnUploadSuccess = true,
  uploadType = "auto",
  endpoint = "imageUploader", // Default endpoint
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | null>(null);
  // mime captured at selection time; used to render preview after upload success
  const [pendingMime, setPendingMime] = useState<string | null>(null);
  // store fileKey returned from success callback so we can delete via server action
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  // disable upload button after successful upload until delete
  const [disabled, setDisabled] = useState(false);
  // show deleting state while server action runs
  const [deleting, setDeleting] = useState(false);
  // revoke object URL when component unmounts or when preview changes
  // this avoids leaking blobs
  const revokePreview = (url?: string | null) => {
    if (url?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }
  };

  // keep track to cleanup when a new preview is set
  const setNewPreview = (url: string | null, mime: string | null) => {
    revokePreview(previewUrl);
    setPreviewUrl(url);
    setPreviewMime(mime);
  };

  // cleanup on unmount
  // cleanup on unmount or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {
          /* ignore */
        }
      }
    };
  }, [previewUrl]);

  return (
    <div>
      {/* UploadButton is rendered below when allowed (not previewing/disabled/deleting) */}

      {renderPreview && previewUrl && previewMime && (
        <div className="mt-2">
          <div className="flex items-start gap-2">
            {previewMime.startsWith("image") ? (
              <Image src={previewUrl} alt="preview" height={400} width={400} />
            ) : previewMime.startsWith("video") ? (
              // simple video preview using the object URL
              <video controls src={previewUrl} className="max-w-full h-auto">
                {/* minimal track to satisfy accessibility linter */}
                <track kind="captions" />
              </video>
            ) : (
              <a href={previewUrl} target="_blank" rel="noreferrer">
                Open file preview
              </a>
            )}
            {/* delete button: prefer server action if provided */}
            {uploadedFileKey && (
              <button
                onClick={async () => {
                  // guard
                  if (!uploadedFileKey) return;
                  try {
                    setDeleting(true);
                    const ok = await deleteUTFileAction(uploadedFileKey);
                    if (ok) {
                      // revoke any blob preview
                      if (previewUrl?.startsWith("blob:")) {
                        try {
                          URL.revokeObjectURL(previewUrl);
                        } catch {
                          /* ignore */
                        }
                      }
                      // reset all preview/upload state so user can upload again
                      setPreviewUrl(null);
                      setPreviewMime(null);
                      setPendingMime(null);
                      setUploadedFileKey(null);
                      setDisabled(false);
                      toast.success("Deleted file");
                    } else {
                      toast.error("Failed to delete file");
                    }
                  } catch (err) {
                    console.error("delete error", err);
                    toast.error("Error deleting file");
                  } finally {
                    setDeleting(false);
                  }
                }}
                type="button"
                aria-label="delete uploaded file"
                className="text-red-600"
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "✕"}
              </button>
            )}
          </div>
        </div>
      )}
      {/* hide or disable the upload button when a preview is shown or upload is disabled */}
      {!(previewUrl && previewMime) && !disabled && !deleting && (
        <div className="mt-2">
          <UploadButton
            endpoint={endpoint}
            onBeforeUploadBegin={(files) => {
              // files is File[] — capture mime/type and create a preview
              try {
                if (files && files.length > 0) {
                  if (onFilesChange) onFilesChange(files);
                  const first = files[0];
                  const mime = first.type || null;
                  // always capture mime from selected file for later use
                  setPendingMime(mime);
                  if (renderPreview && !previewOnUploadSuccess && first) {
                    // create object URL for preview (preview before upload)
                    const url = URL.createObjectURL(first);
                    setNewPreview(url, mime);
                  }
                  console.log("Files about to be uploaded:", files);
                }
              } catch (e) {
                console.log("onBeforeUploadBegin error:", e);
              }
              return files;
            }}
            onClientUploadComplete={(res) => {
              // normalize response safely without using `any`
              const entry = Array.isArray(res)
                ? (res[0] as unknown as Record<string, unknown>)
                : undefined;
              const uploadedFileUrl =
                (entry?.["ufsUrl"] as string | undefined) ?? null;
              // extract provider file key (id) from whatever location it may be in the response
              const fileKey =
                (entry?.["fileKey"] as string | undefined) ??
                (entry?.["key"] as string | undefined) ??
                ((entry?.["data"] as Record<string, unknown> | undefined)?.[
                  "key"
                ] as string | undefined) ??
                null;
              if (fileKey) setUploadedFileKey(String(fileKey));
              // disable upload button until the file is deleted
              setDisabled(true);
              // On upload success, optionally render preview using remote URL
              if (renderPreview && previewOnUploadSuccess) {
                // revoke any previous blob preview
                if (previewUrl?.startsWith("blob:")) {
                  try {
                    URL.revokeObjectURL(previewUrl);
                  } catch {
                    /* ignore */
                  }
                }
                // use the server-returned URL for preview and use the pending mime if available
                setPreviewUrl(uploadedFileUrl);
                // prefer pending mime, fall back to the explicit uploadType if provided
                if (pendingMime) {
                  setPreviewMime(pendingMime);
                } else if (uploadType !== "auto") {
                  setPreviewMime(uploadType);
                } else {
                  setPreviewMime(null);
                }
              }
              toast.success("Upload Completed");
              if (onUploadComplete && uploadedFileUrl) {
                onUploadComplete(uploadedFileUrl);
              }
              if (onFileChange && uploadedFileUrl) {
                onFileChange(uploadedFileUrl);
              }
            }}
            onChange={(files) => {
              // also forward files on change (some UploadButton implementations call this)
              if (files && files.length > 0 && onFilesChange)
                onFilesChange(files);
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
              if (onUploadError) {
                onUploadError(error);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
