import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function GET() {
  try {
    const coupons = isSupabaseConfigured()
      ? await supabaseDb.getCoupons()
      : db.getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json(
        { success: false, error: "Code and discount value are required" },
        { status: 400 }
      );
    }

    const couponPayload = {
      code: body.code,
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minAmount: Number(body.minAmount) || 0,
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    let coupon;
    if (isSupabaseConfigured()) {
      coupon = await supabaseDb.createCoupon(couponPayload);
    } else {
      coupon = db.createCoupon(couponPayload);
    }

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required" },
        { status: 400 }
      );
    }

    let deleted = false;
    if (isSupabaseConfigured()) {
      deleted = await supabaseDb.deleteCoupon(id);
    } else {
      deleted = db.deleteCoupon(id);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
