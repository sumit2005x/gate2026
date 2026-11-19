import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code || amount === undefined) {
      return NextResponse.json(
        { success: false, message: "Code and amount are required" },
        { status: 400 }
      );
    }

    const validation = isSupabaseConfigured()
      ? await supabaseDb.validateCoupon(code, Number(amount))
      : db.validateCoupon(code, Number(amount));

    return NextResponse.json({
      success: validation.valid,
      discount: validation.discount,
      message: validation.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Validation failed" },
      { status: 500 }
    );
  }
}
