import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, email, phone, name, couponCode, paymentMethod } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: "Product ID and customer email are required" },
        { status: 400 }
      );
    }

    const product = db.getProductById(productId) || db.getProductBySlug(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let finalAmount = product.price;
    let discountAmount = 0;

    if (couponCode) {
      const couponVal = db.validateCoupon(couponCode, product.price);
      if (couponVal.valid) {
        discountAmount = couponVal.discount;
        finalAmount = Math.max(0, product.price - discountAmount);
      }
    }

    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const simulatedPaymentId = `pay_${randomSuffix}`;

    const order = db.createOrder({
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      amount: finalAmount,
      customerEmail: email.trim().toLowerCase(),
      customerPhone: phone ? phone.trim() : "",
      customerName: name ? name.trim() : undefined,
      couponCode: discountAmount > 0 ? couponCode.trim().toUpperCase() : null,
      discountAmount,
      paymentId: simulatedPaymentId,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "completed",
    });

    return NextResponse.json({
      success: true,
      order,
      downloadUrl: `/api/download/${order.downloadToken}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
