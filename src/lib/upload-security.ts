/**
 * File upload security: magic byte validation, safe filenames,
 * and MIME-to-extension mapping.
 */

/** Magic byte signatures for file type verification */
const MAGIC_BYTES: Record<string, { bytes: number[]; offset: number }[]> = {
  "image/jpeg": [{ bytes: [0xff, 0xd8, 0xff], offset: 0 }],
  "image/png": [
    { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], offset: 0 },
  ],
  "image/gif": [{ bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 }],
  "image/webp": [
    { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
    { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  ],
  "application/pdf": [{ bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 }],
  "video/mp4": [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
  "video/webm": [{ bytes: [0x1a, 0x45, 0xdf, 0xa3], offset: 0 }],
  "video/quicktime": [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }],
};

/**
 * Validate that a file's actual content matches its claimed MIME type
 * by checking magic bytes (file signature).
 */
export function validateMagicBytes(
  buffer: Buffer,
  claimedType: string
): boolean {
  const signatures = MAGIC_BYTES[claimedType];
  if (!signatures) return false;

  for (const sig of signatures) {
    if (buffer.length < sig.offset + sig.bytes.length) return false;
    const matches = sig.bytes.every(
      (byte, i) => buffer[sig.offset + i] === byte
    );
    if (!matches) return false;
  }
  return true;
}

/** Map validated MIME types to safe file extensions */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Derive extension from MIME type (never from user filename). */
export function getExtensionFromMimeType(mimeType: string): string | null {
  return MIME_TO_EXT[mimeType] ?? null;
}

/**
 * Generate a safe filename with zero user-controlled components.
 * Format: {prefix}-{timestamp}-{random}.{ext}
 */
export function generateSafeFilename(
  prefix: string,
  mimeType: string
): string {
  const ext = getExtensionFromMimeType(mimeType);
  if (!ext) throw new Error(`Unsupported MIME type: ${mimeType}`);
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${ts}-${rand}.${ext}`;
}

/** Validate that a string contains only alphanumeric chars + hyphens (for docKey, face params) */
export function sanitizeAlphanumeric(input: string): string {
  return input.replace(/[^a-zA-Z0-9-]/g, "");
}
