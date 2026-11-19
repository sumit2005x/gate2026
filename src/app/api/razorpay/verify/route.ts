import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      email,
      phone,
      name,
      couponCode,
      discountAmount,
      amount,
    } = body;

    if (!productId || !email || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: "Missing required payment or customer details" },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay cryptographic signature
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpay_order_id || "",
      paymentId: razorpay_payment_id,
      signature: razorpay_signature || "",
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // 2. Fetch product details
    let product = null;
    if (isSupabaseConfigured()) {
      product =
        (await supabaseDb.getProductById(productId)) ||
        (await supabaseDb.getProductBySlug(productId)) ||
        db.getProductById(productId) ||
        db.getProductBySlug(productId);
    } else {
      product = db.getProductById(productId) || db.getProductBySlug(productId);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 3. Create permanent order in database
    const orderPayload = {
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      amount: Number(amount) || product.price,
      customerEmail: email.trim().toLowerCase(),
      customerPhone: phone ? phone.trim() : "",
      customerName: name ? name.trim() : undefined,
      couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
      discountAmount: Number(discountAmount) || 0,
      paymentId: razorpay_payment_id,
      paymentMethod: "RAZORPAY_UPI",
      paymentStatus: "completed" as const,
    };

    let order;
    if (isSupabaseConfigured()) {
      order = await supabaseDb.createOrder(orderPayload);
    } else {
      order = db.createOrder(orderPayload);
    }

    return NextResponse.json({
      success: true,
      order,
      downloadUrl: `/api/download/${order.downloadToken}`,
      message: "Payment successfully verified and order recorded",
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
