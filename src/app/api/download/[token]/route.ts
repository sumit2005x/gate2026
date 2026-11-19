import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";
import { isSupabaseConfigured, getSupabaseSignedDownloadUrl } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Check Supabase if configured, otherwise fallback to local db
    let success = false;
    let product: any = null;
    let order: any = null;

    if (isSupabaseConfigured()) {
      order = await supabaseDb.getOrderByToken(token);
      if (order) {
        const res = await supabaseDb.incrementDownload(token);
        success = res.success;
        product = res.product;
      }
    }

    if (!order) {
      order = db.getOrderByToken(token);
      if (order) {
        const localRes = db.incrementDownload(token);
        success = localRes.success;
        product = localRes.product;
      }
    }

    if (!order) {
      return new NextResponse("Invalid or expired download link", { status: 404 });
    }

    // Ensure product is resolved
    if (!product) {
      if (isSupabaseConfigured()) {
        product =
          (await supabaseDb.getProductById(order.productId)) ||
          (await supabaseDb.getProductBySlug(order.productSlug));
      }
      if (!product) {
        product =
          db.getProductById(order.productId) ||
          db.getProductBySlug(order.productSlug) ||
          db.getProducts()[0];
      }
    }

    if (!product) {
      return new NextResponse("Product associated with order not found", { status: 404 });
    }

    // 1. If stored in Supabase private bucket
    if (product.digitalFileUrl?.startsWith("supabase://")) {
      const signedUrl = await getSupabaseSignedDownloadUrl(product.digitalFileUrl, 300);
      if (signedUrl) {
        return NextResponse.redirect(signedUrl);
      }
    }

    // 2. If stored in Cloudflare R2 or public cloud storage
    if (
      product.digitalFileUrl?.startsWith("http://") ||
      product.digitalFileUrl?.startsWith("https://")
    ) {
      return NextResponse.redirect(product.digitalFileUrl);
    }

    // 3. Fallback: Determine local file location
    let relativePath = product.digitalFileUrl || "";
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
        const filename = `${product.slug || "download"}.pdf`;
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
    console.error("Download route error:", error);
    return new NextResponse("Download failed. Please contact support.", {
      status: 500,
    });
  }
}
