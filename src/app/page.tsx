import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import Form from "@/components/form";

export const dynamic = "force-dynamic";

export default async function Home() {
  async function getUploadUrl(fileName: string, fileType: string) {
    "use server";

    const command = new PutObjectCommand({
      Key: crypto.randomUUID(),
      Bucket: Resource.MyBucket.name,
      ContentType: fileType,
    });

    const s3Client = new S3Client({});
    const url = await getSignedUrl(s3Client, command);

    return url;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <main style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form getUploadUrl={getUploadUrl} />
      </main>
    </div>
  );
}
