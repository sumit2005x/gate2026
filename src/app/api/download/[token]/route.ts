import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { success, product } = db.incrementDownload(token);

    if (!success || !product) {
      return new NextResponse("Invalid or expired download link", { status: 404 });
    }

    // If file is stored in Cloudflare R2 or external cloud storage
    if (
      product.digitalFileUrl.startsWith("http://") ||
      product.digitalFileUrl.startsWith("https://")
    ) {
      return NextResponse.redirect(product.digitalFileUrl);
    }

    // Determine local file location
    let relativePath = product.digitalFileUrl;
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }

    const fullFilePath = path.join(process.cwd(), "public", relativePath);

    if (!fs.existsSync(fullFilePath)) {
      // Fallback to sample download if specific file doesn't exist
      const fallbackPath = path.join(
        process.cwd(),
        "public/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf"
      );
      if (fs.existsSync(fallbackPath)) {
        const fileBuffer = fs.readFileSync(fallbackPath);
        const filename = `${product.slug}.pdf`;
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }
      return new NextResponse("Digital file not found on server", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullFilePath);
    const filename = path.basename(fullFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    return new NextResponse(`Download error: ${error.message}`, { status: 500 });
  }
}
