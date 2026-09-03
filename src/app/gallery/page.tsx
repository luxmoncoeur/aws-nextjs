import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import Link from "next/link";
import { Resource } from "sst";
import { deleteFile } from "@/app/actions";
import DeleteButton from "@/components/DeleteButton";
import { formatBytes } from "@/lib/limits";
import { createPresignedGetUrl, s3 } from "@/lib/s3";

export const dynamic = "force-dynamic";

const MAX_ITEMS = 50;
const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function GalleryPage() {
  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: Resource.MyBucket.name,
      MaxKeys: MAX_ITEMS,
    }),
  );

  const objects = (response.Contents ?? [])
    .flatMap((object) =>
      object.Key
        ? [
            {
              key: object.Key,
              size: object.Size ?? 0,
              lastModified: object.LastModified ?? new Date(0),
            },
          ]
        : [],
    )
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

  const files = await Promise.all(
    objects.map(async (object) => ({
      ...object,
      url: await createPresignedGetUrl(object.key),
    })),
  );

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <h1 className="mb-1 text-xl font-bold text-slate-900">Gallery</h1>
      <p className="mb-6 text-sm text-slate-500">
        The {MAX_ITEMS} most recent uploads. Links expire after one hour.
      </p>

      {files.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No files uploaded yet.{" "}
          <Link href="/" className="text-blue-600 underline">
            Upload one
          </Link>{" "}
          to see it here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {files.map((file) => (
            <li
              key={file.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="min-w-0">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  title={file.key}
                  className="block truncate text-sm font-medium text-blue-600 hover:underline"
                >
                  {file.key}
                </a>
                <p className="text-xs text-slate-500">
                  {formatBytes(file.size)} ·{" "}
                  {dateFormatter.format(file.lastModified)}
                </p>
              </div>
              <form action={deleteFile}>
                <input type="hidden" name="key" value={file.key} />
                <DeleteButton />
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
