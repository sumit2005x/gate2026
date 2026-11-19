import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const stats = db.getStats();
    const categories = db.getCategories();
    const coupons = db.getCoupons();
    const settings = db.getSettings();

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
