import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectCheckoutCard from "@/components/DirectCheckoutCard";
import ProductDetailsClient from "./ProductDetailsClient";
import MobileQuickBuyHeader from "@/components/MobileQuickBuyHeader";
import StickyMobileBuyBar from "@/components/StickyMobileBuyBar";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseDb } from "@/lib/supabase-db";
import { ShieldCheck, Download, Share2, ArrowLeft, ChevronDown, HelpCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  const products = db.getProducts({ includeUnpublished: true });
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;
  if (isSupabaseConfigured()) {
    product = (await supabaseDb.getProductBySlug(slug)) || db.getProductBySlug(slug) || db.getProductById(slug);
  } else {
    product = db.getProductBySlug(slug) || db.getProductById(slug);
  }

  if (!product) {
    notFound();
  }

  let moreFromCreator = [];
  if (isSupabaseConfigured()) {
    const creatorProds = await supabaseDb.getProducts({ creator: product.creatorHandle });
    moreFromCreator = creatorProds.filter((p) => p.id !== product.id).slice(0, 4);
  } else {
    moreFromCreator = db
      .getProducts({ creator: product.creatorHandle })
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }

  const productFaqs = [
    {
      q: "Can I use the CBT Simulator on my laptop/Mac/Linux?",
      a: "Yes. The CBT Simulator is an offline, standalone web application. Just open the .html file inside Google Chrome, Edge, Safari, or Firefox on any PC, laptop, or tablet. No installation, login, or internet required.",
    },
    {
      q: "Are the solutions step-by-step or just answer keys?",
      a: "Every single question in both the 90-Day Patterns Book and the 10 Mocks includes detailed, mathematical, step-by-step derivations, diagrammatic proofs, and C-code walkthroughs—not just single-letter answer keys.",
    },
    {
      q: "How do I receive the files after payment?",
      a: "Immediately after UPI/card payment via Razorpay, you will get an instant download link on your screen, plus a permanent backup link delivered directly to your entered email address.",
    },
    {
      q: "What if the files are corrupted or I need support?",
      a: "We offer a 7-day replacement or full refund guarantee if any files are corrupt or not as described. You also have permanent access to your purchases via the 'My purchases' page.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Top breadcrumb */}
        <div className="border-b border-rule bg-paper-2/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <Link href="/browse" className="hover:text-ink flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Browse</span>
              </Link>
              <span>/</span>
              <span>Sold by </span>
              <Link
                href={`/@${product.creatorHandle}`}
                className="font-semibold text-ink underline"
              >
                {product.creatorName}
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-muted">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </div>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Visual Gallery, Mobile Header, Mobile Checkout & Detailed Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              {/* Mobile-Only Header: Title, Price & Quick Buy Button above the fold */}
              <MobileQuickBuyHeader product={product} />

              {/* Cover Gallery & Interactive Sample Viewer */}
              <ProductDetailsClient product={product} />

              {/* Mobile-Only Checkout Card Placement: Right below the cover carousel */}
              <div id="direct-checkout-mobile" className="lg:hidden pt-2">
                <DirectCheckoutCard product={product} />
              </div>

              {/* Description & Concrete Breakdown */}
              <div className="space-y-6 pt-6 border-t border-rule">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
                    What's Inside & Overview
                  </h3>
                  <div className="prose prose-neutral max-w-none text-ink-2 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-paper-2/40 border border-rule p-5 sm:p-7 rounded-2xl font-sans">
                    {product.description}
                  </div>
                </div>

                {/* Specification Table */}
                <div className="pt-6 border-t border-rule">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-semibold mb-4">
                    Product Details & Compatibility
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-sm">
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Format</dt>
                      <dd className="font-medium text-ink">{product.format}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Target Exam</dt>
                      <dd className="font-medium text-accent">GATE CSE 2026 / 2027</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Language</dt>
                      <dd className="font-medium text-ink">{product.language}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Size</dt>
                      <dd className="font-medium text-ink">{product.fileSize}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Delivery</dt>
                      <dd className="font-medium text-ink">{product.delivery}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Access</dt>
                      <dd className="font-medium text-ink">{product.access}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Refunds</dt>
                      <dd className="font-medium text-ink">{product.refunds}</dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Category</dt>
                      <dd className="font-medium text-ink">{product.category}</dd>
                    </div>
                  </dl>
                </div>

                {/* Product FAQ Accordion */}
                <div className="pt-6 border-t border-rule">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-4 h-4 text-accent" />
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                      Frequently Asked Questions
                    </h4>
                  </div>
                  <div className="divide-y divide-rule border-y border-rule">
                    {productFaqs.map((faq, idx) => (
                      <details key={idx} className="group py-4 text-left cursor-pointer">
                        <summary className="flex items-center justify-between text-sm sm:text-base font-medium text-ink list-none">
                          <span className="flex items-center gap-2.5">
                            <span className="font-mono text-xs text-muted">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span>{faq.q}</span>
                          </span>
                          <span className="text-muted group-open:rotate-180 transition-transform">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </summary>
                        <p className="mt-3 text-xs sm:text-sm text-ink-2 pl-7 leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Right Column: Title, Subtitle & Sticky Direct Checkout Card */}
            <div id="direct-checkout-desktop" className="hidden lg:block lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                  <span className="bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded border border-accent/20">
                    GATE CSE 2026 / 2027 Sprint Edition
                  </span>
                  <span>·</span>
                  <span>Instant access</span>
                  <span>·</span>
                  <span>{product.format}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
                  {product.title}
                </h1>

                {product.subtitle && (
                  <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Instant Checkout Form Card */}
              <DirectCheckoutCard product={product} />
            </div>
          </div>
        </div>

        {/* More from Creator Section */}
        {moreFromCreator.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-rule">
            <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-rule">
              <div>
                <span className="num-pill block mb-1">RECOMMENDED</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  More from {product.creatorName}
                </h3>
              </div>
              <Link
                href={`/@${product.creatorHandle}`}
                className="text-xs font-mono text-ink underline"
              >
                Visit store →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {moreFromCreator.map((p) => (
                <Link key={p.id} href={`/p/${p.slug}`} className="group block">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-rule bg-paper-2 mb-3">
                    <img
                      src={p.coverUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-ink line-clamp-1 group-hover:underline">
                    {p.title}
                  </h4>
                  <p className="font-serif font-bold text-base text-ink mt-1">₹{p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile Buy Bar (Pinned to bottom on phones) */}
      <StickyMobileBuyBar product={product} />

      <Footer />
    </div>
  );
}
