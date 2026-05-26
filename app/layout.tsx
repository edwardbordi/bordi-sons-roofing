import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Canonical production origin. Update if the live domain differs.
const SITE_URL = "https://www.bordiandsons.com";

const ogImage = {
  url: "/images/hero-scene.jpg",
  width: 2400,
  height: 1340,
  alt: "Bordi & Sons Roofing — a finished home with a new GAF roof",
};

const DESCRIPTION =
  "Family-owned, GAF Master Elite roofing in Haddon Township, NJ. Roof replacement, repair, and gutters — honest pricing, premium materials, and a lifetime material warranty. Get a free, no-pressure estimate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bordi & Sons Roofing | GAF-Certified Roofers in Haddon Twp, NJ",
    template: "%s | Bordi & Sons Roofing",
  },
  description: DESCRIPTION,
  applicationName: "Bordi & Sons Roofing",
  alternates: { canonical: "/" },
  keywords: [
    "roofing",
    "roof replacement",
    "roof repair",
    "GAF Master Elite",
    "gutters",
    "Haddon Township NJ",
    "New Jersey roofer",
    "storm damage repair",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Bordi & Sons Roofing | GAF-Certified Roofers in Haddon Twp, NJ",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Bordi & Sons Roofing",
    locale: "en_US",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bordi & Sons Roofing | GAF-Certified Roofers in Haddon Twp, NJ",
    description: DESCRIPTION,
    images: [ogImage],
  },
};

// LocalBusiness structured data for local SEO / rich results.
// NOTE: phone, address, and ratings are placeholders on this demo — replace
// with the real NAP + verified review data before going live.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": `${SITE_URL}/#business`,
  name: "Bordi & Sons Roofing",
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-scene.jpg`,
  logo: `${SITE_URL}/images/bordi-logo.png`,
  telephone: "+1-555-555-5555",
  email: "hello@bordiandsons.com",
  priceRange: "$$",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Haddon Township",
    addressRegion: "NJ",
    addressCountry: "US",
  },
  areaServed: [
    "Haddon Township",
    "Cherry Hill",
    "Collingswood",
    "Voorhees",
    "Moorestown",
    "Marlton",
    "Haddonfield",
    "Audubon",
  ].map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "8",
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
