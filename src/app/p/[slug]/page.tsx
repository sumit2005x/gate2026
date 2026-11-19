import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectCheckoutCard from "@/components/DirectCheckoutCard";
import ProductDetailsClient from "./ProductDetailsClient";
import { db } from "@/lib/db";
import { ShieldCheck, Download, Share2, ArrowLeft } from "lucide-react";

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
  const product = db.getProductBySlug(slug) || db.getProductById(slug);

  if (!product) {
    notFound();
  }

  const moreFromCreator = db
    .getProducts({ creator: product.creatorHandle })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Visual Gallery & Interactive Preview */}
            <div className="lg:col-span-7 space-y-6">
              <ProductDetailsClient product={product} />

              {/* Mobile Description Preview */}
              <div className="space-y-6 pt-6 border-t border-rule">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
                    About this PDF
                  </h3>
                  <div className="prose prose-neutral max-w-none text-ink-2 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>

                {/* Specification Table */}
                <div className="pt-6 border-t border-rule">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-semibold mb-4">
                    Details
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-sm">
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Format</dt>
                      <dd className="font-medium text-ink">{product.format}</dd>
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
                      <dt className="text-muted">Sold by</dt>
                      <dd className="font-medium text-ink">
                        <Link href={`/@${product.creatorHandle}`} className="underline">
                          {product.creatorName}
                        </Link>
                      </dd>
                    </div>
                    <div className="border-b border-rule pb-2 flex justify-between">
                      <dt className="text-muted">Category</dt>
                      <dd className="font-medium text-ink">{product.category}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Instant Access Badges & Direct Checkout Card */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                  <span className="bg-paper-2 border border-rule px-2 py-0.5 rounded text-ink">
                    Instant access
                  </span>
                  <span>·</span>
                  <span>{product.format}</span>
                  <span>·</span>
                  <span className="text-accent font-semibold">{product.salesCount} bought</span>
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

      <Footer />
    </div>
  );
}
