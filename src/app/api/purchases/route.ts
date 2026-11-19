import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";

export async function POST(req: NextRequest) {
  try {
    const { email, orderOrPaymentId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    let orders = [];
    if (isSupabaseConfigured()) {
      orders = await supabaseDb.lookupOrders({ email, orderOrPaymentId });
    } else {
      orders = db.lookupOrders({ email, orderOrPaymentId });
    }

    const enrichedOrders = await Promise.all(
      orders.map(async (o) => {
        let product = null;
        if (isSupabaseConfigured()) {
          product = (await supabaseDb.getProductBySlug(o.productId)) || db.getProductById(o.productId);
        } else {
          product = db.getProductById(o.productId);
        }

        return {
          ...o,
          product,
          downloadUrl: `/api/download/${o.downloadToken}`,
        };
      })
    );

    return NextResponse.json({ success: true, orders: enrichedOrders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup purchases" },
      { status: 500 }
    );
  }
}
