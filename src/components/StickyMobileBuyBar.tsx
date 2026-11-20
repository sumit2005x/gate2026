"use client";

import { DigitalProduct } from "@/lib/types";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function StickyMobileBuyBar({ product }: { product: DigitalProduct }) {
  const scrollToCheckout = () => {
    // Find either mobile or desktop checkout card
    const target =
      document.getElementById("direct-checkout-mobile") ||
      document.getElementById("direct-checkout-desktop") ||
      document.querySelector("form");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = target.querySelector("input[type='email']") as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-rule px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Price & Guarantee Column */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-ink leading-none">
              ₹{product.price}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <s className="text-xs text-muted line-through font-sans">
                ₹{product.compareAtPrice}
              </s>
            )}
            {discountPercent && (
              <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-accent" />
            <span>Instant Access</span>
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={scrollToCheckout}
          className="btn-ink text-sm py-2.5 px-5 rounded-xl font-semibold shadow-md flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
        >
          <span>Buy Now · ₹{product.price}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
