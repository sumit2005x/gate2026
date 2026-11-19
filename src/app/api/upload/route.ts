import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and make unique
    const originalName = file.name || "uploaded-file";
    const ext = path.extname(originalName) || ".pdf";
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    const uniqueName = `${baseName}_${Date.now()}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    // Calculate human-readable size
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      originalName,
      sizeStr,
      sizeBytes: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}
