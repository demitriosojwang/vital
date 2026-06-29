import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E Contractor | Kenya's Trusted Contractor Vetting & Scoring Platform",
  description: "Find, vet, and rate construction contractors in Kenya. Composite scoring across on-time delivery, quality, sub-contractor payment, responsiveness, and dispute history. Built for county governments, developers, and the Kenyan diaspora.",
  keywords: ["Kenya contractors", "construction vetting", "contractor scoring", "NCA verification", "M-Pesa escrow", "Kenya construction", "contractor reviews", "project tracking"],
  authors: [{ name: "E Contractor" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "E Contractor - Kenya's Trusted Contractor Platform",
    description: "Vet, score, and track construction contractors with transparent composite scoring across 5 dimensions.",
    siteName: "E Contractor",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}