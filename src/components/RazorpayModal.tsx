"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, QrCode, Smartphone, CreditCard, Loader2, X } from "lucide-react";
import { DigitalProduct, Order } from "@/lib/types";

interface RazorpayModalProps {
  product: DigitalProduct;
  amount: number;
  discountAmount: number;
  customerEmail: string;
  customerPhone: string;
  customerName?: string;
  couponCode?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order, downloadUrl: string) => void;
}

export default function RazorpayModal({
  product,
  amount,
  discountAmount,
  customerEmail,
  customerPhone,
  customerName,
  couponCode,
  isOpen,
  onClose,
  onSuccess,
}: RazorpayModalProps) {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [downloadLink, setDownloadLink] = useState("");

  if (!isOpen) return null;

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          email: customerEmail,
          phone: customerPhone,
          name: customerName,
          couponCode: discountAmount > 0 ? couponCode : undefined,
          paymentMethod: method.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Payment failed");
      }

      setCompletedOrder(data.order);
      setDownloadLink(data.downloadUrl);
      setPaymentSuccess(true);
      onSuccess(data.order, data.downloadUrl);
    } catch (err: any) {
      alert(err.message || "Something went wrong processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-paper rounded-2xl shadow-2xl border border-rule overflow-hidden">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white text-base">
              G
            </div>
            <div>
              <h4 className="font-semibold text-sm leading-tight text-white/95">
                gate2026 Digital Publishing
              </h4>
              <p className="text-[11px] text-white/70 font-mono">Secured by Razorpay</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/70 block">Total Payable</span>
            <span className="font-serif text-xl font-bold text-white">₹{amount}</span>
          </div>
        </div>

        {paymentSuccess && completedOrder ? (
          /* Payment Success State */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-ink">Payment Successful!</h3>
              <p className="text-xs text-muted font-mono">
                Order ID: {completedOrder.id} · Ref: {completedOrder.paymentId}
              </p>
            </div>

            <div className="p-4 bg-paper-2 rounded-xl text-left border border-rule space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Item:</span>
                <span className="font-medium text-ink line-clamp-1">{product.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Sent to:</span>
                <span className="font-medium text-ink">{customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Amount Paid:</span>
                <span className="font-semibold text-ink">₹{completedOrder.amount}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={downloadLink}
                download
                className="btn-cobalt w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Download PDF Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs font-mono text-muted hover:text-ink transition-colors"
              >
                Close and return to store
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form State */
          <div className="p-6 space-y-5">
            {/* Order summary pill */}
            <div className="flex items-center justify-between text-xs font-mono p-3 bg-paper-2 rounded-lg border border-rule">
              <span className="text-muted truncate max-w-[200px]">{product.title}</span>
              <span className="font-semibold text-ink">₹{amount}</span>
            </div>

            {/* Payment Methods Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMethod("upi")}
                className={`py-2 px-3 text-xs font-medium rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  method === "upi"
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "border-rule bg-paper-2 text-ink-2 hover:bg-paper-3"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setMethod("card")}
                className={`py-2 px-3 text-xs font-medium rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  method === "card"
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "border-rule bg-paper-2 text-ink-2 hover:bg-paper-3"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setMethod("netbanking")}
                className={`py-2 px-3 text-xs font-medium rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  method === "netbanking"
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "border-rule bg-paper-2 text-ink-2 hover:bg-paper-3"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Method Details */}
            {method === "upi" && (
              <div className="space-y-3 p-4 bg-paper-2 rounded-xl border border-rule text-center">
                <div className="inline-block p-2 bg-white rounded-lg shadow-xs border border-rule">
                  <div className="w-32 h-32 bg-gray-900 flex items-center justify-center text-white text-[10px] font-mono p-2 text-center rounded">
                    [SIMULATED UPI QR CODE]
                    <br />
                    Scan with GPay / PhonePe / Paytm
                  </div>
                </div>

                <div className="text-xs text-muted">
                  Or enter your VPA / UPI ID:
                </div>
                <input
                  type="text"
                  placeholder="e.g. yourname@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-rule bg-paper focus:outline-accent"
                />
              </div>
            )}

            {method === "card" && (
              <div className="space-y-3 p-4 bg-paper-2 rounded-xl border border-rule text-xs">
                <div>
                  <label className="text-muted block mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    disabled
                    value="4111 •••• •••• 4444 (Test Card)"
                    className="w-full px-3 py-2 rounded-md border border-rule bg-paper opacity-90 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-muted block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value="12 / 28"
                      disabled
                      className="w-full px-3 py-2 rounded-md border border-rule bg-paper font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-muted block mb-1">CVV</label>
                    <input
                      type="text"
                      value="•••"
                      disabled
                      className="w-full px-3 py-2 rounded-md border border-rule bg-paper font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div className="p-4 bg-paper-2 rounded-xl border border-rule text-xs space-y-2">
                <label className="text-muted block">Select Your Bank</label>
                <select className="w-full px-3 py-2 rounded-md border border-rule bg-paper text-ink">
                  <option>HDFC Bank</option>
                  <option>State Bank of India</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handlePay}
                disabled={loading}
                className="btn-cobalt w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{amount} &amp; Download PDF</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-muted">
                <span>100% Mock Sandbox / Live Razorpay Ready</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:underline text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
