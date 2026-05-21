"use client";

import styles from "./form.module.css";

export default function Form({ url }: { url: string }) {
  return (
    <form
      className={styles.formCard}
      onSubmit={async (e) => {
        e.preventDefault();

        const file = (e.target as HTMLFormElement).file.files?.[0] ?? null;

        if (!file) {
          alert("Please select an image file first!");
          return;
        }

        const image = await fetch(url, {
          body: file,
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        });

        window.location.href = image.url.split("?")[0];
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
          Upload Image
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Securely stream your photos straight into Amazon S3.
        </p>
      </div>

      <div className={styles.dropzone}>
        <span style={{ fontSize: "1.5rem" }}></span>
        <input
          name="file"
          type="file"
          accept="image/png, image/jpeg"
          className={styles.fileInput}
        />
      </div>

      <button type="submit" className={styles.uploadButton}>
        Upload to AWS
      </button>
    </form>
  );
}
