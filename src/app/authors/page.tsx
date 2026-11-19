import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AuthorsPage() {
  const creators = db.getCreators();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="num-pill block">CREATORS</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
              Publishing creators &amp; educators
            </h1>
            <p className="text-sm sm:text-base text-ink-2">
              Rankers, professors, and field specialists publishing battle-tested digital materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creators.map((c) => (
              <div
                key={c.id}
                className="p-8 rounded-2xl border border-rule bg-paper shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center font-serif text-3xl font-bold shrink-0">
                    {c.name.charAt(0)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-2xl font-bold text-ink">{c.name}</h3>
                      {c.verified && (
                        <CheckCircle2 className="w-4 h-4 text-accent fill-accent/20" />
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted block">
                      @{c.handle} · {c.titlesCount} titles
                    </span>
                    <p className="text-sm text-ink-2 leading-relaxed pt-1">
                      {c.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-rule flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">
                    Instant PDF delivery
                  </span>
                  <Link
                    href={`/browse?creator=${c.handle}`}
                    className="btn-line text-xs py-2 px-5 rounded-full"
                  >
                    <span>View all {c.titlesCount} titles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
