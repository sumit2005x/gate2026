"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Download, Tag, ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { DigitalProduct, Order } from "@/lib/types";
import RazorpayModal from "./RazorpayModal";

interface DirectCheckoutCardProps {
  product: DigitalProduct;
}

export default function DirectCheckoutCard({ product }: DirectCheckoutCardProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const currentPayable = appliedCoupon
    ? Math.max(0, product.price - appliedCoupon.discount)
    : product.price;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: product.price }),
      });
      const data = await res.json();

      if (data.success) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: data.discount,
          message: data.message,
        });
        setCouponError("");
      } else {
        setCouponError(data.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Could not validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address to receive and access your PDF.");
      return;
    }

    setCheckoutLoading(true);
    try {
      // 1. Check if product has a direct Payment Link or if dynamic Payment Link is available
      const res = await fetch("/api/razorpay/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          email,
          phone,
          name,
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await res.json();
      if (data.success && data.paymentLink) {
        // Redirect directly to Razorpay Payment Link
        window.location.href = data.paymentLink;
        return;
      }

      // 2. Fallback: open official Razorpay popup modal
      setModalOpen(true);
    } catch {
      setModalOpen(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bg-paper-2 rounded-2xl border border-rule p-6 sm:p-7 shadow-xs">
      {/* Price Header */}
      <div className="space-y-2 pb-5 border-b border-rule">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider text-muted flex items-center gap-1.5">
            <span className="text-accent">◆</span> One-time price · Instant access
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-paper text-ink px-2 py-0.5 rounded border border-rule">
            <Download className="w-3 h-3 text-accent" />
            Downloadable
          </span>
        </div>

        <div className="flex items-baseline gap-3 pt-1">
          <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            ₹{currentPayable}
          </span>
          {product.compareAtPrice && (
            <s className="font-sans text-lg text-muted line-through">
              ₹{product.compareAtPrice}
            </s>
          )}
          {discountPercent && (
            <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">
              {discountPercent}% off
            </span>
          )}
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg mt-2">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAppliedCoupon(null);
                setCouponCode("");
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleStartCheckout} className="pt-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink-2 mb-1.5">
            Email <span className="text-muted font-normal">(to receive & access your PDF)</span>
          </label>
          <input
            type="email"
            required
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink placeholder:text-muted/70 focus:outline-accent transition-all"
          />
        </div>

        {/* Coupon Code Section */}
        <div className="pt-1">
          {!showCouponInput && !appliedCoupon ? (
            <button
              type="button"
              onClick={() => setShowCouponInput(true)}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Have a coupon code?</span>
            </button>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GATE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 uppercase font-mono px-3 py-1.5 text-xs rounded-lg border border-rule bg-paper text-ink focus:outline-accent"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-ink text-paper hover:opacity-90 disabled:opacity-40"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-red-600 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Buy Button */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={checkoutLoading}
            className="btn-cobalt w-full py-3.5 rounded-xl font-medium text-base shadow-sm group disabled:opacity-50 cursor-pointer active:scale-98 transition-transform"
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Connecting to Razorpay...</span>
              </span>
            ) : (
              <>
                <span>Buy now · ₹{currentPayable}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[12px] text-muted text-center">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Secure UPI / card / netbanking · Instant access</span>
          </div>

          <p className="text-[11px] text-muted leading-relaxed text-center">
            By paying you agree to our Terms and Refund Policy. Delivered instantly as a download.
          </p>
        </div>

        {/* Already bought link */}
        <div className="border-t border-rule pt-4 text-center">
          <Link
            href="/purchases"
            className="text-xs text-ink-2 hover:text-ink font-medium underline underline-offset-4"
          >
            Already bought this? Open my purchases
          </Link>
        </div>
      </form>

      {/* Razorpay simulation modal */}
      <RazorpayModal
        product={product}
        amount={currentPayable}
        discountAmount={appliedCoupon?.discount || 0}
        customerEmail={email}
        customerPhone={phone}
        customerName={name}
        couponCode={appliedCoupon?.code}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(order, dlUrl) => {
          setCompletedOrder(order);
          setDownloadUrl(dlUrl);
        }}
      />
    </div>
  );
}
