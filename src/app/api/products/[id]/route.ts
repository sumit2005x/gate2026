import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let product = null;

    if (isSupabaseConfigured()) {
      product = (await supabaseDb.getProductBySlug(id)) || db.getProductById(id);
    } else {
      product = db.getProductById(id) || db.getProductBySlug(id);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    let updated = null;
    if (isSupabaseConfigured()) {
      updated = await supabaseDb.updateProduct(id, body);
    } else {
      updated = db.updateProduct(id, body);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let deleted = false;

    if (isSupabaseConfigured()) {
      deleted = await supabaseDb.deleteProduct(id);
    } else {
      deleted = db.deleteProduct(id);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found or delete failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
