import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";
import { db } from "@/lib/db";
import { ArrowRight, BookOpen, ShieldCheck, Download, Sparkles, Check, ChevronDown } from "lucide-react";

export default function HomePage() {
  const allProducts = db.getProducts({ includeUnpublished: false });
  const featured = allProducts.slice(0, 5);
  const bundles = allProducts.filter((p) => p.format.toLowerCase().includes("bundle"));
  const categories = db.getCategories();
  const creators = db.getCreators();

  const faqs = [
    {
      q: "How do I pay?",
      a: "Through Razorpay: UPI (GPay, PhonePe, Paytm), debit and credit cards, netbanking and wallets. The download unlocks the moment payment goes through. No account needed.",
    },
    {
      q: "Where do I find my purchases later?",
      a: "Signed in: in your Library. Bought without an account: open My purchases and enter your email with your order number (BD…) or the Razorpay payment ID (pay_…) from Razorpay's receipt.",
    },
    {
      q: "I bought without logging in. Why isn't it in my Library?",
      a: "Purchases made without an account stay with the order, not with your login, so they won't show in your Library. You still have full access: open My purchases, enter the email you paid with and your order number (BD…) or Razorpay payment ID (pay_…), and download from there. Orders bought on the same device are already listed on that page.",
    },
    {
      q: "Can I see it before I buy?",
      a: "Most titles have a free sample: open it from the product page. Page count, file size and access period are listed there too.",
    },
    {
      q: "What if the file doesn't open?",
      a: "Write to us within 7 days of buying. If the file is broken or not as described, we fix it or refund you in full. See the Refund Policy.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="border-b border-rule pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-8">
              {/* Top provenance badge */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                <span className="font-semibold text-ink">Independent digital publishing</span>
                <span>·</span>
                <span>Est. 2026 · India</span>
                <span className="hidden sm:inline">·</span>
                <span className="bg-paper-2 border border-rule px-2.5 py-0.5 rounded-full text-ink font-mono text-[11px]">
                  {allProducts.length} titles
                </span>
                <span className="bg-paper-2 border border-rule px-2.5 py-0.5 rounded-full text-ink font-mono text-[11px]">
                  {creators.length} creator
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-[1.05]">
                  Pages worth <br className="hidden sm:inline" />
                  paying for.
                </h1>
                <p className="text-lg sm:text-xl text-ink-2 max-w-2xl leading-relaxed">
                  Notes, cheat sheets and guides made by people who have been through the exam.
                  Pay by UPI, download instantly, keep them forever in your library.
                </p>
              </div>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/browse" className="btn-ink text-base px-6 py-3 rounded-full">
                  <span>Browse PDFs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a href="#new-this-week" className="btn-line text-base px-6 py-3 rounded-full">
                  <span>Discover titles</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: NEW THIS WEEK / FEATURED TITLES */}
        <section id="new-this-week" className="py-16 sm:py-20 border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
              <div>
                <span className="num-pill block mb-1">01 · RECENT RELEASES</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  New this week
                </h2>
              </div>
              <Link
                href="/browse?sort=new"
                className="text-sm font-medium text-ink hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>All titles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {featured.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: COMPLETE PACKS & BUNDLES */}
        {bundles.length > 0 && (
          <section className="py-16 bg-paper-2/60 border-b border-rule">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
                <div>
                  <span className="num-pill block mb-1">02 · VALUE PACKS</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                    Complete Bundles
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="p-6 rounded-2xl border border-rule bg-paper shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-muted">
                        <span>BUNDLE · {bundle.creatorName}</span>
                        <span className="bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded">
                          Save 26%
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-ink">
                        {bundle.title}
                      </h3>
                      <p className="text-sm text-ink-2 line-clamp-2">
                        {bundle.subtitle}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-rule flex items-center justify-between">
                      <div>
                        <span className="font-serif text-3xl font-bold text-ink">
                          ₹{bundle.price}
                        </span>
                        {bundle.compareAtPrice && (
                          <s className="ml-2 font-sans text-sm text-muted line-through">
                            ₹{bundle.compareAtPrice}
                          </s>
                        )}
                      </div>

                      <Link
                        href={`/p/${bundle.slug}`}
                        className="btn-cobalt text-xs py-2 px-4 rounded-full"
                      >
                        <span>View Bundle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: THE INDEX / TOPICS */}
        <section className="py-16 sm:py-20 border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
              <div>
                <span className="num-pill block mb-1">03 · TOPICS</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  The index · {categories.length} topics
                </h2>
              </div>
              <Link
                href="/categories"
                className="text-sm font-medium text-ink hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>All topics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.slug}`}
                  className="p-5 rounded-xl border border-rule bg-paper hover:bg-paper-2 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-muted block">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-medium text-ink text-base group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-muted border border-rule px-2 py-0.5 rounded-full bg-paper-2">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: CREATORS */}
        <section className="py-16 sm:py-20 border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
              <div>
                <span className="num-pill block mb-1">04 · AUTHORS</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  Creators
                </h2>
              </div>
              <Link
                href="/authors"
                className="text-sm font-medium text-ink hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>Everyone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creators.map((c) => (
                <Link
                  key={c.id}
                  href={`/@${c.handle}`}
                  className="p-6 rounded-2xl border border-rule bg-paper hover:bg-paper-2 transition-all flex items-start gap-5 group"
                >
                  <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-ink group-hover:underline">
                        {c.name}
                      </h3>
                      {c.verified && (
                        <span className="text-[10px] font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                          VERIFIED CREATOR
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-muted">{c.titlesCount} titles published</p>
                    <p className="text-sm text-ink-2 leading-relaxed pt-1 line-clamp-2">
                      {c.bio}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: NEWSLETTER SIGNUP */}
        <section className="py-20 border-b border-rule bg-paper-2/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              New titles, once a month. <em className="font-normal italic">Nothing else.</em>
            </h2>
            <p className="text-sm text-ink-2">
              Get notified when top educators and rankers release new question banks and cheat sheets.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* SECTION: FAQ ACCORDION */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center space-y-2">
              <span className="num-pill">05 · ANSWERS</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                Questions
              </h2>
            </div>

            <div className="divide-y divide-rule border-y border-rule">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group py-5 text-left cursor-pointer">
                  <summary className="flex items-center justify-between text-base sm:text-lg font-medium text-ink list-none">
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-muted group-open:rotate-180 transition-transform">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <p className="mt-4 text-sm sm:text-base text-ink-2 pl-8 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
