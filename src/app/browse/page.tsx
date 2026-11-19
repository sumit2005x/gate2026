"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { DigitalProduct, Category } from "@/lib/types";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function BrowsePage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { slug: "all", name: "All Titles" },
    { slug: "gate-preparation", name: "GATE Preparation" },
    { slug: "computer-science", name: "Computer Science" },
    { slug: "data-analytics", name: "Data Analytics & AI" },
    { slug: "electronics", name: "Electronics & Comm." },
  ];

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.append("category", selectedCategory);
        if (search) params.append("search", search);
        if (sortBy) params.append("sort", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, search, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-10 space-y-3">
            <span className="num-pill block">CATALOGUE</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
              Browse all publications
            </h1>
            <p className="text-sm sm:text-base text-ink-2">
              Instant PDF downloads. Lifetime access in your library.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="space-y-4 mb-10 pb-6 border-b border-rule">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, subject, exam code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-rule bg-paper-2 text-ink placeholder:text-muted focus:outline-accent"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <ArrowUpDown className="w-4 h-4 text-muted" />
                <span className="text-xs font-mono text-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-mono bg-paper-2 text-ink border border-rule rounded-lg px-3 py-2 focus:outline-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`text-xs font-mono whitespace-nowrap px-4 py-1.5 rounded-full border transition-all ${
                    selectedCategory === c.slug
                      ? "bg-ink text-paper border-ink font-semibold"
                      : "bg-paper-2 text-ink-2 border-rule hover:border-ink hover:text-ink"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-muted">
              Loading titles from archive...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-serif text-2xl text-ink">No publications found</p>
              <p className="text-xs font-mono text-muted">
                Try modifying your search or clearing active filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="btn-line text-xs py-1.5 px-4 rounded-full mt-2"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
