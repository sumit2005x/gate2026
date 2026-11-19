"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, Download, Lock } from "lucide-react";
import { DigitalProduct } from "@/lib/types";

interface SamplePreviewModalProps {
  product: DigitalProduct;
  isOpen: boolean;
  onClose: () => void;
  onBuyClick: () => void;
}

export default function SamplePreviewModal({
  product,
  isOpen,
  onClose,
  onBuyClick,
}: SamplePreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const pages =
    product.samplePages && product.samplePages.length > 0
      ? product.samplePages
      : ["/samples/sample-page-1.svg", "/samples/sample-page-2.svg"];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-paper rounded-2xl shadow-2xl border border-rule flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rule bg-paper-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-serif font-bold text-ink text-base line-clamp-1">
                {product.title}
              </h3>
              <p className="text-xs font-mono text-muted">
                Sample Reader · Page {currentPage + 1} of {pages.length} (Free Preview)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onBuyClick();
              }}
              className="btn-cobalt text-xs py-1.5 px-3.5 rounded-full hidden sm:inline-flex"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock all {product.pageCount} pages · ₹{product.price}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink hover:bg-paper-3 rounded-full transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Center Screen */}
        <div className="flex-1 bg-[#202020] relative flex items-center justify-center overflow-auto p-4 sm:p-8">
          <div className="relative max-w-2xl w-full max-h-full bg-paper rounded-lg shadow-2xl overflow-hidden border border-white/10">
            {/* Sample Image / SVG */}
            <img
              src={pages[currentPage]}
              alt={`Preview page ${currentPage + 1}`}
              className="w-full h-auto object-contain block mx-auto"
            />
          </div>

          {/* Navigation Arrows */}
          {currentPage > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-paper/90 hover:bg-paper text-ink rounded-full shadow-lg border border-rule transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentPage < pages.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-paper/90 hover:bg-paper text-ink rounded-full shadow-lg border border-rule transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom control bar */}
        <div className="px-6 py-3 border-t border-rule bg-paper-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="px-3 py-1 text-xs font-mono border border-rule rounded-md bg-paper disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-3"
            >
              ← Prev
            </button>
            <span className="text-xs font-mono text-muted px-2">
              {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === pages.length - 1}
              className="px-3 py-1 text-xs font-mono border border-rule rounded-md bg-paper disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-3"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono hidden md:inline">
              Sample only · Complete PDF has {product.pageCount} pages with full solutions
            </span>
            <button
              onClick={() => {
                onClose();
                onBuyClick();
              }}
              className="btn-ink text-xs py-1.5 px-4 rounded-full"
            >
              Buy full PDF · ₹{product.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
