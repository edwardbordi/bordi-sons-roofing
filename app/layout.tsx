import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site.config";
import { brand } from "@/config/brand.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// All business facts come from config/site.config.ts (single source of truth).
// NOTE: H4 will extract metadata + JSON-LD into lib/seo.ts and make them
// locale-aware; for now they're sourced from config inline.

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
  alternates: { canonical: "/" },
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

// LocalBusiness structured data, sourced from config.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  image: `${site.url}/images/hero-scene.jpg`,
  logo: `${site.url}${brand.logo.src}`,
  telephone: site.phone.display,
  email: site.email,
  priceRange: "$$",
  description: site.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  areaServed: site.areaServed.map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  // TODO(reviews): add `aggregateRating` + `review` ONLY when real, verified
  // review data exists. Fabricated ratings violate schema.org/Google policy and
  // must never ship on a public domain.
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
