import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { isSupabaseConfigured, uploadToSupabaseStorage } from "./supabase";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "gate2026-digital-assets";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN; // e.g. https://pub-xxxx.r2.dev or custom domain

let s3Client: S3Client | null = null;

if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function uploadToStorage({
  buffer,
  originalName,
  mimeType,
}: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}): Promise<{ url: string; filename: string; sizeStr: string; sizeBytes: number }> {
  const ext = path.extname(originalName) || ".pdf";
  const baseName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");
  const uniqueName = `${baseName}_${Date.now()}${ext}`;
  const sizeBytes = buffer.length;
  const sizeInMb = (sizeBytes / (1024 * 1024)).toFixed(1);
  const sizeStr = sizeBytes > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(sizeBytes / 1024)} KB`;

  // 1. If Supabase is configured, upload to Supabase Storage (100% free, 0 card needed)
  if (isSupabaseConfigured()) {
    try {
      const isLockedPdf = mimeType === "application/pdf" && !originalName.toLowerCase().includes("sample");
      const uploadRes = await uploadToSupabaseStorage({
        buffer,
        originalName,
        mimeType,
        isLocked: isLockedPdf,
      });

      return {
        url: uploadRes.url,
        filename: path.basename(uploadRes.path),
        sizeStr,
        sizeBytes,
      };
    } catch (supabaseErr) {
      console.error("Supabase Storage upload error, trying next fallback:", supabaseErr);
    }
  }

  // 2. If Cloudflare R2 is configured, upload to Cloudflare R2
  if (s3Client && R2_BUCKET_NAME) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: uniqueName,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      const publicUrl = R2_PUBLIC_DOMAIN
        ? `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${uniqueName}`
        : `/api/r2-file/${uniqueName}`;

      return {
        url: publicUrl,
        filename: uniqueName,
        sizeStr,
        sizeBytes,
      };
    } catch (error) {
      console.error("Cloudflare R2 upload error, falling back to local:", error);
    }
  }

  // 2. Fallback to local filesystem (works on local machine and Node servers)
  const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const destinationPath = path.join(UPLOADS_DIR, uniqueName);
  fs.writeFileSync(destinationPath, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    filename: uniqueName,
    sizeStr,
    sizeBytes,
  };
}
