import { useMemo, useState } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadAdminPackageImage } from "@workspace/api-client-react";
import type { AdminUploadResponse } from "@workspace/api-zod";

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

export function ImageUploadField({
  packageId,
  onUploaded,
}: {
  packageId: string;
  onUploaded: (upload: AdminUploadResponse) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

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
      const response = await uploadAdminPackageImage({
        packageId,
        fileName: file.name,
        contentType: file.type,
        base64,
        altText: file.name.replace(/\.[^.]+$/, ""),
        isHero: true,
      });
      setProgress(100);
      onUploaded(response);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-md border border-[#D7C6A5] bg-white/70 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[#1A1714]">
        <ImageUp className="size-4" />
        Package image
      </div>
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="bg-white"
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt=""
          className="h-36 w-full rounded-md object-cover"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
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
        disabled={!file || !packageId || isUploading}
        onClick={handleUpload}
        className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]"
      >
        {isUploading ? "Uploading..." : "Upload image"}
      </Button>
    </div>
  );
}
