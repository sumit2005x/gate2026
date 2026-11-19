import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code || amount === undefined) {
      return NextResponse.json(
        { success: false, message: "Code and amount are required" },
        { status: 400 }
      );
    }

    const validation = db.validateCoupon(code, Number(amount));
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
