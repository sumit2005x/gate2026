import Link from "next/link";
import { DigitalProduct } from "@/lib/types";

interface ProductCardProps {
  product: DigitalProduct;
  index?: number;
  featured?: boolean;
}

export default function ProductCard({ product, index, featured = false }: ProductCardProps) {
  const indexStr = index !== undefined ? String(index + 1).padStart(2, "0") : null;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <Link href={`/p/${product.slug}`} className="group block text-left active:scale-[0.98] transition-all">
      <div className="transition-transform duration-300 group-hover:-translate-y-1">
        {/* Layered book sheets representation */}
        <div className="sheets relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] border border-rule bg-paper-2 shadow-sm">
            {/* If uploaded or SVG cover exists */}
            <img
              src={product.coverUrl || "/covers/nat-master.svg"}
              alt={`Cover of ${product.title}`}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Subtle top index badge */}
            {indexStr && (
              <div className="absolute top-3 left-3 bg-paper/90 backdrop-blur-sm border border-rule/80 px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-ink shadow-xs">
                {indexStr}
              </div>
            )}

            {/* Format badge */}
            <div className="absolute bottom-3 right-3 bg-ink/85 backdrop-blur-sm text-paper px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">
              {product.format?.toLowerCase().includes("bundle") || product.format?.toLowerCase().includes("zip") ? "BUNDLE" : "PDF"}
            </div>
          </div>
        </div>
      </div>

      {/* Meta and typography */}
      <div className="mt-3.5 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
          <span>{product.creatorName}</span>
          <span>·</span>
          <span>{product.category}</span>
        </div>

        <h3 className="line-clamp-2 text-[15px] sm:text-[16px] font-medium leading-snug text-ink underline-offset-4 group-hover:underline">
          {product.title}
        </h3>

        <div className="pt-1 flex items-baseline gap-2">
          <span className="font-serif text-[24px] sm:text-[26px] font-bold leading-none text-ink">
            ₹{product.price}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <s className="font-sans text-[13px] text-muted line-through">
              ₹{product.compareAtPrice}
            </s>
          )}
          {discountPercent && (
            <span className="text-[11px] font-mono text-accent font-semibold ml-1">
              {discountPercent}% off
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
