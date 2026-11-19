"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Download, CheckCircle2, ShieldCheck, ArrowRight, FileText, AlertCircle } from "lucide-react";
import { Order, DigitalProduct } from "@/lib/types";

interface EnrichedOrder extends Order {
  product?: DigitalProduct;
  downloadUrl: string;
}

export default function PurchasesPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [error, setError] = useState("");
  const [successToken, setSuccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const urlEmail = params.get("email");
      if (token) setSuccessToken(token);
      if (urlEmail) {
        setEmail(urlEmail);
        fetch("/api/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: urlEmail }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.orders) {
              setOrders(data.orders);
              setSearched(true);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          orderOrPaymentId: orderId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to search purchases");
      }

      setOrders(data.orders || []);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Could not retrieve purchases");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <span className="num-pill block">YOUR LIBRARY</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
              My purchases
            </h1>
            <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
              Retrieve and re-download your digital PDFs at any time.
              Enter the email you used at checkout, with your optional Order Number or Razorpay Payment ID.
            </p>
          </div>

          {/* Success Banner from Razorpay Payment Link redirect */}
          {successToken && (
            <div className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Payment Received! Your PDF is ready to download.</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your purchase has been verified and registered to your email. Click below to begin your download.
              </p>
              <div className="pt-1">
                <a
                  href={`/api/download/${successToken}`}
                  download
                  className="btn-cobalt inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-medium shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Purchased PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Lookup Form */}
          <form
            onSubmit={handleLookup}
            className="p-6 sm:p-8 rounded-2xl border border-rule bg-paper-2 shadow-xs space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student.gate@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                  Order / Payment ID <span className="font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD-904128 or pay_..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-muted font-mono">
                💡 Tip: Try with <code>student.gate@gmail.com</code> to see pre-seeded demo order.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="btn-ink text-sm py-2.5 px-6 rounded-full w-full sm:w-auto"
              >
                {loading ? "Searching archive..." : "Find Purchases"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </form>

          {/* Results List */}
          {searched && (
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-rule pb-3">
                <h2 className="font-serif text-2xl font-bold text-ink">
                  Found {orders.length} {orders.length === 1 ? "purchase" : "purchases"}
                </h2>
                <span className="text-xs font-mono text-muted">{email}</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-rule bg-paper-2 space-y-2">
                  <p className="font-serif text-xl text-ink">No purchases found</p>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    We could not locate an order under this email address. Please double-check the email on your Razorpay payment confirmation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl border border-rule bg-paper flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-20 rounded-lg overflow-hidden border border-rule bg-paper-2 shrink-0">
                          <img
                            src={order.product?.coverUrl || "/covers/nat-master.svg"}
                            alt={order.productTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                          <h3 className="font-serif text-lg font-bold text-ink">
                            {order.productTitle}
                          </h3>
                          <p className="text-xs font-mono text-muted">
                            Order {order.id} · Ref: {order.paymentId} · Downloaded {order.downloadCount} times
                          </p>
                          <p className="text-xs text-ink-2">
                            Bought on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })} · ₹{order.amount}
                          </p>
                        </div>
                      </div>

                      {/* Download CTA */}
                      <div className="w-full sm:w-auto flex sm:flex-col gap-2">
                        <a
                          href={order.downloadUrl}
                          download
                          className="btn-cobalt text-xs py-2.5 px-5 rounded-full flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                        </a>

                        <span className="text-[11px] font-mono text-muted text-center hidden sm:block">
                          Lifetime access
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
