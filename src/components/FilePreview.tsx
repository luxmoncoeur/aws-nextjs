"use client";

import { useEffect, useState } from "react";

interface FilePreviewProps {
  file: File;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Object URLs stream from disk instead of loading the whole file into
    // memory like a base64 data URL would.
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={previewUrl}
        alt={`Preview of ${file.name}`}
        className="max-h-64 w-auto rounded-lg border border-slate-200"
      />
    );
  }
  if (file.type.startsWith("audio/")) {
    return <audio controls src={previewUrl} className="w-full" />;
  }
  if (file.type.startsWith("video/")) {
    return (
      <video
        controls
        src={previewUrl}
        className="max-h-64 w-full rounded-lg border border-slate-200"
      />
    );
  }
  if (file.type === "application/pdf") {
    return (
      <iframe
        title={`Preview of ${file.name}`}
        src={`${previewUrl}#view=fitH`}
        className="h-64 w-full rounded-lg border border-slate-200"
      />
    );
  }
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
      {file.name}{" "}
      <span className="text-slate-400">({file.type || "unknown type"})</span>
    </div>
  );
}
