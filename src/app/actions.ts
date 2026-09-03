"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { Resource } from "sst";
import {
  BLOCKED_CONTENT_TYPES,
  MAX_FILE_SIZE_BYTES,
  formatBytes,
} from "@/lib/limits";
import { createPresignedPutUrl, s3 } from "@/lib/s3";

export type UploadUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function getUploadUrl(
  sizeBytes: number,
  contentType: string,
): Promise<UploadUrlResult> {
  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0) {
    return { ok: false, error: "The selected file is empty." };
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `File is larger than the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`,
    };
  }
  if (BLOCKED_CONTENT_TYPES.has(contentType)) {
    return { ok: false, error: "This file type is not allowed." };
  }

  // Unknown extensions arrive with an empty content type; S3 must receive the
  // exact type that was signed, so normalize before signing and uploading.
  const normalizedType = contentType || "application/octet-stream";

  const url = await createPresignedPutUrl({
    sizeBytes,
    contentType: normalizedType,
  });
  return { ok: true, url };
}

export async function deleteFile(formData: FormData): Promise<void> {
  const key = formData.get("key");
  if (typeof key !== "string" || !key) return;

  await s3.send(
    new DeleteObjectCommand({ Bucket: Resource.MyBucket.name, Key: key }),
  );
  revalidatePath("/gallery");
}
