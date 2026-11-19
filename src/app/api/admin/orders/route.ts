import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET() {
  try {
    const orders = isSupabaseConfigured()
      ? await supabaseDb.getOrders()
      : db.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
