"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, complete the progress bar
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      // Fast initial jump, then slower increment
      setProgress(25);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          const increment = Math.max(1, (85 - prev) * 0.15);
          return Math.min(85, prev + increment);
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Ignore external links, anchor jumps, new tabs, and non-http schemes
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Check if it's the exact same path and query
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start loading bar immediately
      setLoading(true);
      setProgress(15);
    };

    // Custom events for programmatic navigation
    const handleStart = () => {
      setLoading(true);
      setProgress(15);
    };
    const handleStop = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("start-nav-progress", handleStart);
    window.addEventListener("stop-nav-progress", handleStop);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("start-nav-progress", handleStart);
      window.removeEventListener("stop-nav-progress", handleStop);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent">
      {/* Moving progress bar */}
      <div
        className="h-full bg-accent transition-all duration-200 ease-out shadow-[0_0_12px_var(--color-accent,#2563EB)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? "width 150ms ease-out, opacity 250ms ease-in" : "width 200ms ease-out",
        }}
      />
      {/* Glowing tip */}
      <div
        className="absolute top-0 right-0 h-[3px] w-24 bg-gradient-to-r from-transparent to-white/60 blur-[1px] transform -translate-y-px"
        style={{
          display: progress > 0 && progress < 100 ? "block" : "none",
          left: `calc(${progress}% - 96px)`,
        }}
      />
    </div>
  );
}
