"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, QrCode, Smartphone, CreditCard, Loader2, X, Download } from "lucide-react";
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

  // Dynamically load Razorpay checkout script
  useEffect(() => {
    if (!isOpen) return;

    if (!document.getElementById("razorpay-checkout-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Launch official Razorpay standard checkout popup
  const handleOfficialRazorpay = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          couponCode: discountAmount > 0 ? couponCode : undefined,
          email: customerEmail,
          phone: customerPhone,
          name: customerName,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // If simulated mode (no live keys configured)
      if (orderData.isSimulated || !(window as any).Razorpay) {
        // Run simulated instant payment
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 12)}`,
            razorpay_signature: "simulated_signature",
            productId: product.id,
            email: customerEmail,
            phone: customerPhone,
            name: customerName,
            couponCode: discountAmount > 0 ? couponCode : undefined,
            discountAmount,
            amount,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setCompletedOrder(verifyData.order);
          setDownloadLink(verifyData.downloadUrl);
          setPaymentSuccess(true);
          onSuccess(verifyData.order, verifyData.downloadUrl);
        } else {
          throw new Error(verifyData.error || "Verification failed");
        }
        setLoading(false);
        return;
      }

      // 2. Open official Razorpay modal popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "gate2026",
        description: product.title,
        image: "https://nzrljcrxkmzgvwdwmhwt.supabase.co/storage/v1/object/public/products-public/covers/gate_nat_master.svg",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: product.id,
                email: customerEmail,
                phone: customerPhone,
                name: customerName,
                couponCode: discountAmount > 0 ? couponCode : undefined,
                discountAmount,
                amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setCompletedOrder(verifyData.order);
              setDownloadLink(verifyData.downloadUrl);
              setPaymentSuccess(true);
              onSuccess(verifyData.order, verifyData.downloadUrl);
            } else {
              alert(verifyData.error || "Payment verification failed");
            }
          } catch (err: any) {
            alert(err.message || "Error verifying payment signature");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: customerName || "",
          email: customerEmail,
          contact: customerPhone || "",
        },
        notes: {
          productId: product.id,
          productSlug: product.slug,
        },
        theme: {
          color: "#0C2340",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      alert(err.message || "Something went wrong opening Razorpay");
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
              <p className="text-[11px] text-white/70 font-mono">Official Razorpay Gateway</p>
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
                Order: {completedOrder.id} · Ref: {completedOrder.paymentId}
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
                <Download className="w-4 h-4" />
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

            {/* Methods Preview */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl border border-rule bg-paper-2 flex flex-col items-center text-center gap-1">
                <QrCode className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-medium text-ink">UPI &amp; QR</span>
                <span className="text-[9px] text-muted font-mono">GPay, PhonePe</span>
              </div>

              <div className="p-3 rounded-xl border border-rule bg-paper-2 flex flex-col items-center text-center gap-1">
                <CreditCard className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-medium text-ink">Cards</span>
                <span className="text-[9px] text-muted font-mono">Debit &amp; Credit</span>
              </div>

              <div className="p-3 rounded-xl border border-rule bg-paper-2 flex flex-col items-center text-center gap-1">
                <Smartphone className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-medium text-ink">Netbanking</span>
                <span className="text-[9px] text-muted font-mono">50+ Banks</span>
              </div>
            </div>

            {/* Customer Details Recap */}
            <div className="text-xs space-y-1.5 p-3.5 bg-paper-2/70 rounded-xl border border-rule">
              <div className="flex justify-between">
                <span className="text-muted">Delivery Email:</span>
                <span className="font-mono font-medium text-ink">{customerEmail}</span>
              </div>
              {customerPhone && (
                <div className="flex justify-between">
                  <span className="text-muted">Phone:</span>
                  <span className="font-mono font-medium text-ink">{customerPhone}</span>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleOfficialRazorpay}
                disabled={loading}
                className="btn-cobalt w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{amount} via Razorpay UPI / Cards</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-muted">
                <span>Instant PDF unlock upon payment</span>
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
