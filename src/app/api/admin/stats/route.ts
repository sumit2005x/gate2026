import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET() {
  try {
    let stats, categories, coupons, settings;

    if (isSupabaseConfigured()) {
      [stats, categories, coupons, settings] = await Promise.all([
        supabaseDb.getStats(),
        supabaseDb.getCategories(),
        supabaseDb.getCoupons(),
        supabaseDb.getSettings(),
      ]);
    } else {
      stats = db.getStats();
      categories = db.getCategories();
      coupons = db.getCoupons();
      settings = db.getSettings();
    }

    return NextResponse.json({
      success: true,
      stats,
      categories,
      coupons,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
