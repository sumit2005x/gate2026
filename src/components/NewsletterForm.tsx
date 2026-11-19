"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <p className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 py-2.5 px-4 rounded-full inline-block">
        ✓ You are subscribed to Byline monthly dispatches ({email}).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
      <input
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2.5 text-sm rounded-full border border-rule bg-paper focus:outline-accent"
      />
      <button type="submit" className="btn-ink text-sm py-2 px-5 rounded-full">
        <span>Subscribe</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
