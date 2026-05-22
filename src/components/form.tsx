"use client";

import styles from "./form.module.css";

interface FormProps {
  getUploadUrl: (fileName: string, fileType: string) => Promise<string>;
}

export default function Form({ getUploadUrl }: FormProps) {
  return (
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
              "Content-Disposition": `attachment; filename="${file.name}"`,
            },
          });

          if (response.ok) {
            window.location.href = presignedUrl.split("?")[0];
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
        <input name="file" type="file" className={styles.fileInput} />
      </div>

      <button type="submit" className={styles.uploadButton}>
        Upload to AWS
      </button>
    </form>
  );
}
