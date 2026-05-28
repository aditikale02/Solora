import { useEffect, useMemo, useState } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { uploadAdminDestinationImage, uploadAdminGenericImage, uploadAdminPackageImage } from "@workspace/api-client-react";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 5 * 1024 * 1024;

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.split(",", 2)[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

type UploadTarget =
  | { targetType: "package"; targetId: string }
  | { targetType: "destination"; targetId: string }
  | { targetType: "generic"; targetId?: string };

export function ImageUploadField({
  targetType,
  targetId,
  title = "Upload image",
  isHero = true,
  sortOrder = 0,
  onUploaded,
}: UploadTarget & {
  title?: string;
  isHero?: boolean;
  sortOrder?: number;
  onUploaded: (publicUrl: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleUpload() {
    if (!file) return;
    setError(null);

    if (!allowedTypes.has(file.type)) {
      setError("Upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > maxBytes) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setIsUploading(true);
    setProgress(20);

    try {
      const base64 = await toBase64(file);
      setProgress(55);
      const response =
        targetType === "package"
          ? await uploadAdminPackageImage({
              packageId: targetId,
              fileName: file.name,
              contentType: file.type,
              base64,
              altText: file.name.replace(/\.[^.]+$/, ""),
              isHero,
              sortOrder,
            })
          : targetType === "destination"
            ? await uploadAdminDestinationImage({
                destinationId: targetId,
                fileName: file.name,
                contentType: file.type,
                base64,
                altText: file.name.replace(/\.[^.]+$/, ""),
                isHero,
                sortOrder,
              })
            : await uploadAdminGenericImage({
                fileName: file.name,
                contentType: file.type,
                base64,
                folder: targetId ?? "admin-uploads",
              });
      setProgress(100);
      onUploaded(response.upload.publicUrl);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      className={`grid gap-3 rounded-md border p-4 transition ${
        isDragging ? "border-[#8B6340] bg-[#FBF6EE]" : "border-[#D7C6A5] bg-white/70"
      }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        setFile(event.dataTransfer.files?.[0] ?? null);
      }}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[#1A1714]">
        <ImageUp className="size-4" />
        {title}
      </div>
      <div className="rounded-md border border-dashed border-[#D7C6A5] bg-white px-4 py-6 text-sm text-[#6A5A47]">
        Drag and drop an image here, or choose a file below.
      </div>
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          setError(null);
          setFile(event.target.files?.[0] ?? null);
          setProgress(0);
        }}
        className="bg-white caret-[#1A1714]"
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt=""
          className="h-36 w-full rounded-md object-cover"
        />
      ) : null}
      {isUploading ? (
        <div className="h-2 overflow-hidden rounded-full bg-[#D7C6A5]">
          <div className="h-full bg-[#C9A96E]" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button
        type="button"
        disabled={!file || isUploading || (targetType !== "generic" && !targetId)}
        onClick={handleUpload}
        className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]"
      >
        {isUploading ? <Spinner className="mr-2 size-4" /> : null}
        {isUploading ? "Uploading..." : "Upload image"}
      </Button>
    </div>
  );
}
