import type { Metadata } from "next";
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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-accent/20 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
