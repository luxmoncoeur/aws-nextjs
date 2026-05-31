"use client";

import { useState } from "react";
import styles from "./form.module.css";
import FilePreview from "./FilePreview";

interface FormProps {
  getUploadUrl: (fileName: string, fileType: string) => Promise<string>;
}

export default function Form({ getUploadUrl }: FormProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [s3Url, setS3Url] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
    } else {
      setCurrentFile(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
      }}
    >
      <form
        className={styles.formCard}
        onSubmit={async (e) => {
          e.preventDefault();

          const file = (e.target as HTMLFormElement).file.files?.[0] ?? null;

          if (!file) {
            alert("Please select a file first!");
            return;
          }

          try {
            const presignedUrl = await getUploadUrl(file.name, file.type);
            const response = await fetch(presignedUrl, {
              body: file,
              method: "PUT",
              headers: {
                "Content-Type": file.type,
                "Content-Disposition": `inline; filename="${file.name}"`,
              },
            });

            if (response.ok) {
              const finalUrl = presignedUrl.split("?")[0];
              setS3Url(finalUrl);
              alert("Upload successful!");
            } else {
              alert("Upload to S3 failed");
            }
          } catch (error) {
            console.error(error);
            alert("An error occured during the upload");
          }
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            Upload Any File
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Securely stream your files straight into Amazon S3.
          </p>
        </div>

        <div className={styles.dropzone}>
          <span style={{ fontSize: "1.5rem" }}></span>
          <input
            name="file"
            type="file"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className={styles.uploadButton}>
          Upload to AWS
        </button>
      </form>

      {s3Url && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#d1fae5",
            border: "1px solid #10b981",
            borderRadius: "8px",
            marginTop: "1rem",
            color: "#065f46",
            fontSize: "0.875rem",
          }}
        >
          <strong>Success!</strong> File uploaded successfully.
          <a
            href={s3Url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              color: "#047857",
              textDecoration: "underline",
              marginTop: "0.25rem",
              fontWeight: "bold",
            }}
          >
            Open in new tab
          </a>
        </div>
      )}

      {currentFile && <FilePreview file={currentFile} />}
    </div>
  );
}
