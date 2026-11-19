import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, email, phone, name, couponCode } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: "Product ID and customer email are required" },
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

    // 1. If product already has a custom static payment link (e.g., https://rzp.io/l/xyz)
    if (product.paymentLinkUrl && product.paymentLinkUrl.trim().startsWith("http")) {
      const url = new URL(product.paymentLinkUrl.trim());
      url.searchParams.set("email", email.trim());
      if (phone) url.searchParams.set("contact", phone.trim());
      if (name) url.searchParams.set("name", name.trim());

      return NextResponse.json({
        success: true,
        paymentLink: url.toString(),
        isPreCreated: true,
      });
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
        finalAmount = Math.max(1, product.price - discountAmount);
      }
    }

    // 2. If Razorpay API keys are configured, generate dynamic Razorpay Payment Link
    if (isRazorpayConfigured()) {
      const razorpay = getRazorpayInstance();
      if (!razorpay) throw new Error("Razorpay instance not available");

      const origin = req.headers.get("origin") || req.nextUrl.origin || "https://gate2026.vercel.app";
      const referenceId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const link = await (razorpay as any).paymentLink.create({
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        accept_partial: false,
        reference_id: referenceId,
        description: product.title,
        customer: {
          name: name ? name.trim() : "GATE Aspirant",
          email: email.trim().toLowerCase(),
          contact: phone ? phone.trim() : undefined,
        },
        notify: {
          sms: Boolean(phone),
          email: true,
        },
        reminder_enable: true,
        notes: {
          productId: product.id,
          productSlug: product.slug,
          customerEmail: email.trim().toLowerCase(),
          customerName: name || "",
          customerPhone: phone || "",
          discountAmount: String(discountAmount),
          couponCode: couponCode || "",
        },
        callback_url: `${origin}/api/razorpay/callback`,
        callback_method: "get",
      });

      return NextResponse.json({
        success: true,
        paymentLink: link.short_url,
        paymentLinkId: link.id,
        isPreCreated: false,
      });
    }

    // 3. Fallback / Simulation Mode
    return NextResponse.json({
      success: true,
      paymentLink: null,
      isSimulated: true,
      finalAmount,
    });
  } catch (error: any) {
    console.error("Payment link creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
