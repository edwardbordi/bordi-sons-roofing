import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ogImage = {
  url: "/images/hero-image.jpg",
  width: 1284,
  height: 716,
  alt: "The Bordi & Sons farmhouse",
};

export const metadata: Metadata = {
  title: "Bordi & Sons Roofing",
  description:
    "Premium GAF-certified roofing services. Quality you can trust.",
  openGraph: {
    title: "Bordi & Sons Roofing",
    description:
      "Premium GAF-certified roofing services. Quality you can trust.",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bordi & Sons Roofing",
    description:
      "Premium GAF-certified roofing services. Quality you can trust.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
