import { createClient } from "@supabase/supabase-js";

export function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

export function getSupabaseServiceKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    getSupabaseAnonKey()
  );
}

export const BUCKET_PUBLIC = "products-public";
export const BUCKET_LOCKED = "products-locked";

/**
 * Check whether Supabase environment variables are configured
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  return Boolean(
    url &&
    url.startsWith("https://") &&
    !url.includes("your-project") &&
    anon &&
    !anon.includes("your-anon-key")
  );
}

/**
 * Standard client for public or browser-safe operations
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
  });
}

/**
 * Admin client with Service Role Key for privileged server-side operations
 * (Bypasses RLS to insert orders, manage locked digital files, etc.)
 */
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseServiceKey() || getSupabaseAnonKey(), {
    auth: { persistSession: false },
  });
}

/**
 * Upload a file directly to Supabase Storage
 */
export async function uploadToSupabaseStorage({
  buffer,
  originalName,
  mimeType,
  isLocked = false,
}: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  isLocked?: boolean;
}): Promise<{ url: string; path: string; bucket: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const bucket = isLocked ? BUCKET_LOCKED : BUCKET_PUBLIC;
  const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
  const baseName = originalName
    .replace(ext, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");
  const filePath = `${isLocked ? "downloads" : "assets"}/${baseName}_${Date.now()}${ext}`;

  // Ensure bucket exists or create it
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, {
        public: !isLocked,
        fileSizeLimit: 104857600, // 100MB
      });
    }
  } catch (err) {
    // Ignore bucket check error and proceed with upload
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase storage upload error: ${error.message}`);
  }

  if (isLocked) {
    // Locked file: store special internal reference
    return {
      url: `supabase://${bucket}/${filePath}`,
      path: filePath,
      bucket,
    };
  } else {
    // Public file: get public URL
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return {
      url: publicData.publicUrl,
      path: filePath,
      bucket,
    };
  }
}

/**
 * Generate a short-lived signed URL for a locked digital product (5 min expiry)
 */
export async function getSupabaseSignedDownloadUrl(
  storageUri: string,
  expiresInSeconds: number = 300
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let bucket = BUCKET_LOCKED;
  let filePath = storageUri;

  if (storageUri.startsWith("supabase://")) {
    const withoutPrefix = storageUri.replace("supabase://", "");
    const parts = withoutPrefix.split("/");
    bucket = parts[0];
    filePath = parts.slice(1).join("/");
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresInSeconds, {
      download: true,
    });

  if (error || !data?.signedUrl) {
    console.error("Failed to generate signed download URL:", error);
    return null;
  }

  return data.signedUrl;
}
