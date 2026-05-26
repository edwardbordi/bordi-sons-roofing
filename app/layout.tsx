import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site.config";
import { alternates as hreflangAlternates } from "@/lib/i18n";
import { localBusinessLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const TITLE = `${site.name} — GAF Master Elite Roofers in ${site.address.locality}, ${site.address.region}`;

const ogImage = {
  url: "/images/hero-scene.jpg",
  width: 2400,
  height: 1340,
  alt: `${site.name} — a finished home with a new GAF roof`,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: TITLE, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/", languages: hreflangAlternates("/") },
  keywords: [
    "roofing",
    "roof replacement",
    "roof repair",
    ...site.certifications,
    "gutters",
    `${site.address.locality} ${site.address.region}`,
    "New Jersey roofer",
    "storm damage repair",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.i18n.bcp47[site.i18n.defaultLocale].replace("-", "_"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: site.description,
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
      lang={site.i18n.bcp47[site.i18n.defaultLocale]}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={localBusinessLd()} />
        {children}
      </body>
    </html>
  );
}
