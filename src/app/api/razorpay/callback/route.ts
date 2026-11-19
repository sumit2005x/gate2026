import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("razorpay_payment_id");
    const paymentLinkId = searchParams.get("razorpay_payment_link_id");
    const status = searchParams.get("razorpay_payment_link_status");

    if (!paymentId) {
      return NextResponse.redirect(new URL("/purchases?error=missing_payment_id", req.url));
    }

    let productId = "";
    let customerEmail = "";
    let customerPhone = "";
    let customerName = "";
    let couponCode: string | null = null;
    let discountAmount = 0;
    let amount = 0;

    // Fetch details from Razorpay if API configured
    if (isRazorpayConfigured() && paymentLinkId) {
      try {
        const razorpay = getRazorpayInstance();
        if (razorpay) {
          const plink: any = await (razorpay as any).paymentLink.fetch(paymentLinkId);
          amount = plink.amount ? plink.amount / 100 : 0;
          productId = plink.notes?.productId || "";
          customerEmail = plink.customer?.email || plink.notes?.customerEmail || "";
          customerPhone = plink.customer?.contact || plink.notes?.customerPhone || "";
          customerName = plink.customer?.name || plink.notes?.customerName || "";
          couponCode = plink.notes?.couponCode || null;
          discountAmount = Number(plink.notes?.discountAmount) || 0;
        }
      } catch (plinkErr) {
        console.error("Error fetching payment link details from Razorpay:", plinkErr);
      }
    }

    // Fallback: If not fetched from Razorpay, look for product
    let product = null;
    if (productId) {
      if (isSupabaseConfigured()) {
        product =
          (await supabaseDb.getProductById(productId)) ||
          (await supabaseDb.getProductBySlug(productId));
      }
      if (!product) {
        product = db.getProductById(productId) || db.getProductBySlug(productId);
      }
    }

    if (!product) {
      const allProducts = isSupabaseConfigured()
        ? await supabaseDb.getProducts()
        : db.getProducts();
      product = allProducts[0];
    }

    if (!product) {
      return NextResponse.redirect(new URL("/purchases?error=product_not_found", req.url));
    }

    // Create the completed order
    const orderPayload = {
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      amount: amount || product.price,
      customerEmail: customerEmail || "customer@gate2026.store",
      customerPhone: customerPhone || "",
      customerName: customerName || "Customer",
      couponCode,
      discountAmount,
      paymentId,
      paymentMethod: "RAZORPAY_PAYMENT_LINK",
      paymentStatus: "completed" as const,
    };

    let order;
    if (isSupabaseConfigured()) {
      order = await supabaseDb.createOrder(orderPayload);
    } else {
      order = db.createOrder(orderPayload);
    }

    // Redirect buyer to purchases page with download token and success state
    const redirectUrl = new URL("/purchases", req.url);
    redirectUrl.searchParams.set("token", order.downloadToken);
    redirectUrl.searchParams.set("email", order.customerEmail);
    redirectUrl.searchParams.set("order", order.id);
    redirectUrl.searchParams.set("success", "true");

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Razorpay callback error:", error);
    return NextResponse.redirect(new URL("/purchases?error=callback_failed", req.url));
  }
}
