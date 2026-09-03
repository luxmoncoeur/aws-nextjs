import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";

// Created once at module scope so warm Lambda invocations reuse connections.
export const s3 = new S3Client({});

const PUT_URL_EXPIRY_SECONDS = 900; // 15 minutes
const GET_URL_EXPIRY_SECONDS = 3600; // 1 hour

export async function createPresignedPutUrl(input: {
  sizeBytes: number;
  contentType: string;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: Resource.MyBucket.name,
    Key: crypto.randomUUID(),
    ContentType: input.contentType,
    // Signed into the URL, so S3 itself rejects uploads that don't match
    // the validated size exactly.
    ContentLength: input.sizeBytes,
  });
  return getSignedUrl(s3, command, { expiresIn: PUT_URL_EXPIRY_SECONDS });
}

export async function createPresignedGetUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: Resource.MyBucket.name,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: GET_URL_EXPIRY_SECONDS });
}
