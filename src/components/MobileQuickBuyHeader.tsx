"use client";

import { DigitalProduct } from "@/lib/types";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function MobileQuickBuyHeader({ product }: { product: DigitalProduct }) {
  const scrollToCheckout = () => {
    const target =
      document.getElementById("direct-checkout-mobile") ||
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
    <div className="lg:hidden space-y-3 pb-6 border-b border-rule">
      {/* Top Tag & Format */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="bg-accent/10 text-accent font-semibold px-2.5 py-0.5 rounded-full border border-accent/25">
          GATE CSE 2026 / 2027 Sprint Edition
        </span>
        <span className="text-muted">·</span>
        <span className="text-muted">{product.format}</span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
        {product.title}
      </h1>

      {/* Subtitle */}
      {product.subtitle && (
        <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
          {product.subtitle}
        </p>
      )}

      {/* Price Block */}
      <div className="flex items-baseline gap-2.5 pt-1">
        <span className="font-serif text-3xl font-bold text-ink">
          ₹{product.price}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <s className="text-sm font-sans text-muted line-through">
            ₹{product.compareAtPrice}
          </s>
        )}
        {discountPercent && (
          <span className="text-xs font-mono text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Quick Buy CTA above the image */}
      <button
        onClick={scrollToCheckout}
        className="btn-ink w-full py-3 rounded-xl text-center font-semibold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
      >
        <span>Instant Access · ₹{product.price}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-muted pt-0.5">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-accent" />
          <span>Instant Download</span>
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>7-Day Guarantee</span>
        </span>
      </div>
    </div>
  );
}
