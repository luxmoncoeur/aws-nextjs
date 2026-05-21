import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import Form from "@/components/form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    Bucket: Resource.MyBucket.name,
  });

  const url = await getSignedUrl(new S3Client({}), command);

  return (
    <div style={{ padding: "2rem" }}>
      <main style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form url={url} />
      </main>
    </div>
  );
}
