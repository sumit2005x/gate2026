import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      try {
        updated = await supabaseDb.updateProduct(id, body);
      } catch (e) {
        console.error("Supabase updateProduct error:", e);
      }
    }

    try {
      const localUpdated = db.updateProduct(id, body);
      if (!updated) {
        updated = localUpdated;
      }
    } catch (localErr) {
      console.warn("Local DB update warning:", localErr);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/browse");
      revalidatePath("/admin");
      if (updated.slug) {
        revalidatePath(`/p/${updated.slug}`);
      }
    } catch (revErr) {
      console.warn("Revalidation error:", revErr);
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
    }

    try {
      const localDel = db.deleteProduct(id);
      if (!deleted) deleted = localDel;
    } catch {}

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found or delete failed" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/browse");
      revalidatePath("/admin");
      revalidatePath(`/p/${id}`);
    } catch (revErr) {
      console.warn("Revalidation error:", revErr);
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
