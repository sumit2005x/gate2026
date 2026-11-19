import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-paper mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-ink">
                gate2026
              </span>
            </Link>
            <p className="text-[15px] text-ink-2 max-w-sm leading-relaxed">
              Study notes, cheat sheets and guides, delivered as PDF the moment you pay.
              Engineered for serious exam candidates.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All payment methods live &amp; verified</span>
            </div>
          </div>

          {/* Read Column */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 font-semibold">
              Read
            </h4>
            <ul className="space-y-2.5 text-[14px] text-ink-2">
              <li>
                <Link href="/browse" className="hover:text-ink transition-colors">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-ink transition-colors">
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/authors" className="hover:text-ink transition-colors">
                  Creators
                </Link>
              </li>
              <li>
                <Link href="/purchases" className="hover:text-ink transition-colors">
                  My purchases
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 font-semibold">
              Help
            </h4>
            <ul className="space-y-2.5 text-[14px] text-ink-2">
              <li>
                <a href="mailto:lessgo.dsa@gmail.com" className="hover:text-ink transition-colors">
                  Contact us
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-ink transition-colors">
                  Help centre &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-accent font-medium hover:underline">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 font-semibold">
              Policies
            </h4>
            <ul className="space-y-2.5 text-[14px] text-ink-2">
              <li>
                <span className="text-muted">Terms &amp; Conditions</span>
              </li>
              <li>
                <span className="text-muted">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted">Refunds &amp; Cancellation</span>
              </li>
              <li>
                <span className="text-muted">Instant Delivery Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-rule mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <p>© 2026 gate2026. Made in India, delivered as PDF.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Payments secured by Razorpay &amp; UPI</span>
            </span>
            <span>·</span>
            <span>Operated by gate2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
