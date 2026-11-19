"use client";

import { useState } from "react";
import { BookOpen, ZoomIn, Eye } from "lucide-react";
import { DigitalProduct } from "@/lib/types";
import SamplePreviewModal from "@/components/SamplePreviewModal";

export default function ProductDetailsClient({ product }: { product: DigitalProduct }) {
  const [selectedImg, setSelectedImg] = useState<string>(product.coverUrl);
  const [previewOpen, setPreviewOpen] = useState(false);

  const gallery = [
    product.coverUrl,
    ...(product.samplePages && product.samplePages.length > 0
      ? product.samplePages
      : ["/samples/sample-page-1.svg", "/samples/sample-page-2.svg"]),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Main Cover View */}
      <div className="relative aspect-[4/5] max-w-lg mx-auto rounded-2xl overflow-hidden border border-rule bg-paper-2 shadow-md group">
        <img
          src={selectedImg || product.coverUrl}
          alt={product.title}
          className="w-full h-full object-cover object-top"
        />

        {/* Floating Read Preview Pill */}
        <button
          onClick={() => setPreviewOpen(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-ink text-xs py-2 px-5 rounded-full shadow-lg flex items-center gap-2 group-hover:scale-105 transition-all"
        >
          <Eye className="w-4 h-4 text-accent" />
          <span>Read free preview</span>
        </button>
      </div>

      {/* Thumbnails strip */}
      {gallery.length > 1 && (
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImg(img)}
              className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                selectedImg === img
                  ? "border-accent ring-2 ring-accent/20 scale-105"
                  : "border-rule opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Free preview modal */}
      <SamplePreviewModal
        product={product}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onBuyClick={() => {
          // Scrolls down to checkout card on mobile
          const card = document.querySelector("form");
          card?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
