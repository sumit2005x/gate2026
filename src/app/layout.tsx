import type { Metadata } from "next";
import { Suspense } from "react";
import NavigationProgressBar from "@/components/NavigationProgressBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "gate2026 — Study PDFs, notes and guides, instant download",
  description:
    "Independent digital publishing. Notes, cheat sheets and guides made by people who have been through the exam. Pay by UPI, download instantly, keep them forever in your library.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('gate_theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-accent/20 selection:text-ink">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
