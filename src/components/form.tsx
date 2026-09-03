"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getUploadUrl } from "@/app/actions";
import { MAX_FILE_SIZE_BYTES, formatBytes } from "@/lib/limits";
import FilePreview from "./FilePreview";
import styles from "./form.module.css";

type Status = { kind: "success" | "error"; message: string } | null;

function uploadToS3(
  url: string,
  file: File,
  contentType: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  // fetch() can't report upload progress, so use XHR.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 responded with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading to S3"));
    xhr.send(file);
  });
}

export default function Form() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<Status>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selected: File | null) => {
    setStatus(null);
    setProgress(0);
    if (selected && selected.size > MAX_FILE_SIZE_BYTES) {
      setFile(null);
      setStatus({
        kind: "error",
        message: `File is larger than the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`,
      });
      return;
    }
    setFile(selected);
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || uploading) return;

    // S3 must receive exactly the type that was signed, including for
    // extensions the browser doesn't recognize.
    const contentType = file.type || "application/octet-stream";

    setUploading(true);
    setStatus(null);
    setProgress(0);

    try {
      const result = await getUploadUrl(file.size, contentType);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      await uploadToS3(result.url, file, contentType, setProgress);
      setStatus({
        kind: "success",
        message: "Upload successful!",
      });
      reset();
    } catch (error) {
      console.error(error);
      setStatus({ kind: "error", message: "An error occurred during the upload." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div>
          <h2 className={styles.heading}>Upload Any File</h2>
          <p className={styles.subtitle}>
            Streamed straight into Amazon S3. Up to{" "}
            {formatBytes(MAX_FILE_SIZE_BYTES)} per file.
          </p>
        </div>

        <div
          className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            selectFile(event.dataTransfer.files?.[0] ?? null);
          }}
        >
          <span className={styles.dropzoneIcon} aria-hidden>
            📁
          </span>
          <p className={styles.dropzoneHint}>Drag &amp; drop a file here, or</p>
          <input
            ref={inputRef}
            name="file"
            type="file"
            className={styles.fileInput}
            onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            aria-label="Choose a file to upload"
          />
        </div>

        {file && <FilePreview file={file} />}

        {uploading && (
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        )}

        <button
          type="submit"
          className={styles.uploadButton}
          disabled={!file || uploading}
        >
          {uploading ? `Uploading… ${progress}%` : "Upload to AWS"}
        </button>
      </form>

      {status && (
        <p
          className={`${styles.status} ${
            status.kind === "success" ? styles.statusSuccess : styles.statusError
          }`}
          role="status"
        >
          {status.message}{" "}
          {status.kind === "success" && (
            <Link href="/gallery" className={styles.statusLink}>
              Open gallery
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
