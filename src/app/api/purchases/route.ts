import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, orderOrPaymentId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    const orders = db.lookupOrders({
      email,
      orderOrPaymentId,
    });

    const enrichedOrders = orders.map((o) => {
      const product = db.getProductById(o.productId);
      return {
        ...o,
        product,
        downloadUrl: `/api/download/${o.downloadToken}`,
      };
    });

    return NextResponse.json({ success: true, orders: enrichedOrders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup purchases" },
      { status: 500 }
    );
  }
}
