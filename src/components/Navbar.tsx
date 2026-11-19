"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ShieldCheck, ArrowRight, Menu, X, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-rule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-ink group-hover:opacity-90">
              gate2026
            </span>
            <span className="text-[11px] font-mono tracking-widest text-muted border border-rule px-1.5 py-0.5 rounded">
              STORE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[15px] text-ink-2 font-medium">
            <Link
              href="/browse"
              className="hover:text-ink transition-colors"
            >
              Browse
            </Link>
          </nav>
        </div>

        {/* Right Navigation & CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/purchases"
            className="text-[14px] text-ink-2 hover:text-ink font-medium px-3 py-1.5 transition-colors"
          >
            My purchases
          </Link>

          <Link
            href="/admin"
            className="text-[13px] font-mono bg-paper-2 hover:bg-paper-3 text-ink px-3 py-1.5 rounded-full border border-rule flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-accent" />
            <span>Admin &amp; Upload</span>
          </Link>

          <Link
            href="/browse"
            className="btn-ink text-[13px] py-1.5 px-4 rounded-full"
          >
            <span>Browse PDFs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/admin"
            className="text-[12px] font-mono bg-paper-2 text-ink px-2.5 py-1 rounded-full border border-rule"
          >
            Admin
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:bg-paper-2 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-rule bg-paper px-4 py-4 space-y-3">
          <Link
            href="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-ink font-medium text-base py-1"
          >
            Browse all PDFs
          </Link>
          <Link
            href="/purchases"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-ink font-medium text-base py-1"
          >
            My purchases
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-accent font-medium text-base py-1"
          >
            Admin Dashboard &amp; Product Upload
          </Link>
        </div>
      )}
    </header>
  );
}
