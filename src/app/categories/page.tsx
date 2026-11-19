import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const categories = db.getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="num-pill block">TAXONOMY</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
              All topics &amp; subjects
            </h1>
            <p className="text-sm sm:text-base text-ink-2">
              Curated notes, question banks, and master books organized by domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((c, idx) => (
              <Link
                key={c.id}
                href={`/browse?category=${c.slug}`}
                className="p-8 rounded-2xl border border-rule bg-paper hover:bg-paper-2 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs text-muted block">
                    TOPIC {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-accent transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-rule flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">
                    {c.count} publications
                  </span>
                  <span className="text-xs font-medium text-ink flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
