// Shared between the client (pre-flight checks) and the server (enforcement).
// Keep this module free of AWS SDK imports so the client can import it.

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

// Files are served from the same CloudFront origin as the app, so stored
// HTML/SVG could execute scripts in that origin. If these types are ever
// needed, serve downloads from a separate domain instead.
export const BLOCKED_CONTENT_TYPES = new Set([
  "text/html",
  "application/xhtml+xml",
  "image/svg+xml",
]);

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
}
