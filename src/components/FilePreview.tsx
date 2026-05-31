import React from "react";
import { useEffect, useState } from "react";

interface FilePreviewProps {
  file: File;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  if (!previewUrl) return null;

  switch (file.type) {
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
      return <audio controls src={previewUrl} />;
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-screen max-w-full"
        />
      );
    case "application/pdf":
      return (
        <iframe
          title="PDF Preview"
          src={`${previewUrl}?#view=fitH`}
          className="w-full h-full border rounded-lg"
        />
      );
    default:
      return (
        <pre
          className="bg-gray-800 text-white p-4 
overflow-x-auto"
        >
          {file.name}
        </pre>
      );
  }
};

export default FilePreview;
