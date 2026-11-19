import Razorpay from "razorpay";
import crypto from "crypto";

const key_id =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  "";
const key_secret =
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_SECRET ||
  "";

/**
 * Check if real live/test Razorpay API credentials are configured
 */
export function isRazorpayConfigured(): boolean {
  return Boolean(
    key_id &&
    !key_id.includes("your_key_id") &&
    key_secret &&
    !key_secret.includes("your_key_secret")
  );
}

export function getRazorpayKeyId(): string {
  return key_id || "rzp_test_gate2026_demo";
}

/**
 * Get configured Razorpay server client
 */
export function getRazorpayInstance(): Razorpay | null {
  if (!isRazorpayConfigured()) return null;
  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verify webhook or checkout callback signature using HMAC-SHA256
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!isRazorpayConfigured()) {
    // In mock / dev mode without live keys, allow simulated payments
    return Boolean(paymentId && (paymentId.startsWith("pay_") || paymentId.length > 5));
  }

  try {
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    return false;
  }
}
