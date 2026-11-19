import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const creator = searchParams.get("creator") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const all = searchParams.get("all") === "true";

    const products = db.getProducts({
      category,
      creator,
      search,
      sort,
      includeUnpublished: all,
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, price, and category are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProduct = db.createProduct({
      title: body.title,
      slug,
      subtitle: body.subtitle || "",
      description: body.description || "",
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      format: body.format || "1 PDF",
      pageCount: Number(body.pageCount) || 10,
      fileSize: body.fileSize || "1.0 MB",
      language: body.language || "English",
      delivery: "Download to your device, instantly after payment",
      access: "Lifetime — buy once, open any time",
      refunds: "7 days if the file is faulty or not as described",
      category: body.category,
      creatorName: body.creatorName || "Gatewala",
      creatorHandle: body.creatorHandle || "gatewala",
      coverUrl: body.coverUrl || "/covers/nat-master.svg",
      jacketStyle: body.jacketStyle || "swiss",
      jacketColor: body.jacketColor || "#344BB0",
      samplePages: body.samplePages || ["/samples/sample-page-1.svg"],
      digitalFileUrl: body.digitalFileUrl || "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
      samplePdfUrl: body.samplePdfUrl || body.digitalFileUrl,
      salesCount: 0,
      featured: Boolean(body.featured),
      published: body.published !== undefined ? Boolean(body.published) : true,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
