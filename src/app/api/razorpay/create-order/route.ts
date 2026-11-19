import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";
import { getRazorpayInstance, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, couponCode } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

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

    // Calculate payable amount with coupon if provided
    let finalAmount = product.price;
    let discountAmount = 0;

    if (couponCode) {
      const couponVal = isSupabaseConfigured()
        ? await supabaseDb.validateCoupon(couponCode, product.price)
        : db.validateCoupon(couponCode, product.price);

      if (couponVal.valid) {
        discountAmount = couponVal.discount;
        finalAmount = Math.max(1, product.price - discountAmount); // Min ₹1 for payment gateway
      }
    }

    const amountInPaise = Math.round(finalAmount * 100);
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 1. If live or test Razorpay keys are configured
    if (isRazorpayConfigured()) {
      const razorpay = getRazorpayInstance();
      if (!razorpay) {
        throw new Error("Razorpay client failed to initialize");
      }

      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          productId: product.id,
          productTitle: product.title,
          slug: product.slug,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        keyId: getRazorpayKeyId(),
        productTitle: product.title,
        finalAmount,
        discountAmount,
        isSimulated: false,
      });
    }

    // 2. Simulated/Demo Mode (when keys not configured yet)
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 16)}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: getRazorpayKeyId(),
      productTitle: product.title,
      finalAmount,
      discountAmount,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
