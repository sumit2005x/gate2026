import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET() {
  try {
    const settings = isSupabaseConfigured()
      ? await supabaseDb.getSettings()
      : db.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let updated;
    if (isSupabaseConfigured()) {
      updated = await supabaseDb.updateSettings(body);
    } else {
      updated = db.updateSettings(body);
    }
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
