import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

export async function POST() {
  try {
    // 1. Reset in local db
    const products = db.getProducts({ includeUnpublished: true });
    for (const p of products) {
      db.updateProduct(p.id, { salesCount: 0 });
    }

    // 2. Reset in Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("products").update({ sales_count: 0 }).neq("id", "");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sold count for all products reset to zero successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset sold counts" },
      { status: 500 }
    );
  }
}
