import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
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

    const result = await uploadToStorage({
      buffer,
      originalName: file.name || "uploaded-file",
      mimeType: file.type || "application/pdf",
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      originalName: file.name,
      sizeStr: result.sizeStr,
      sizeBytes: result.sizeBytes,
      mimeType: file.type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}
