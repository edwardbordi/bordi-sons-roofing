import {
  Shield,
  Droplets,
  Layers,
  Home,
  Wind,
  Crown,
  Award,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Home-page section CONTENT (audit H3). Structured, non-prose page content
 * lives here as typed data so the section components stay brand-agnostic and
 * reusable — they render whatever they're handed. To rebrand, edit this file
 * (and config/*), not the components. (Prose articles live in /content/*.mdx;
 * this is structured section data.)
 */

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Reason = { icon: LucideIcon; title: string; description: string };

export type Testimonial = { quote: string; name: string; town: string };

export type QA = { q: string; a: string };

// Roof-animation label, positioned in the 1284×716 frame coordinate space.
export type RoofLabel = {
  name: string;
  description: string;
  step: number; // installation sequence (a roof is built deck-up)
  dotX: number; // target position (where the component sits)
  dotY: number;
  textX: number; // text position (offset to the side)
  textY: number;
  lineEndX: number; // where the connector line ends, near the text
  side: "left" | "right";
  threshold: number; // scroll progress at which the label fades in
};

export type ShingleColor = { name: string; file: string };

export const homeContent = {
  hero: {
    kicker: "FAMILY-OWNED ROOFING · NEW JERSEY",
    headline: "Roofing you don't have to worry about.",
    subhead:
      "Honest pricing. Premium materials. A Bordi on every job, because our name is on the line. No high-pressure sales. No surprises after the contract is signed.",
    imageAlt:
      "Bordi & Sons family roofing project — finished home with family admiring the new roof",
    primaryCtaLabel: "Get an Instant Estimate",
    secondaryCta: { label: "Watch How It's Built", href: "#process" },
    trust: ["Instant Estimate", "Honest Pricing", "No Pressure"],
  },

  cta: {
    heading: "Ready When You Are.",
    subhead:
      "Get an honest estimate in minutes, not days. No phone calls, no pressure, no surprises.",
    ctaLabel: "Get an Instant Estimate",
    truckAlt: "Bordi & Sons Roofing service truck",
  },

  roofAnimation: {
    eyebrow: "HOW WE BUILD A ROOF",
    heading: "Six layers. Zero shortcuts.",
    subhead:
      "Every Bordi roof includes the complete GAF system — installed exactly as the manufacturer specifies. No corner-cutting, no surprises.",
    // Coordinates in SVG units (viewBox 0 0 1284 716). dotY values tuned so each
    // dot lands on its floating layer in the final frame.
    labels: [
      {
        name: "RIDGE CAP SHINGLES",
        description:
          "Seals the ridge — the most vulnerable point on any roof. Built to withstand wind and weather.",
        step: 6,
        dotX: 680, dotY: 70, textX: 1080, textY: 70, lineEndX: 1070, side: "right", threshold: 0.69,
      },
      {
        name: "RIDGE VENT",
        description:
          "Continuous attic ventilation regulates temperature and moisture, releasing trapped heat. Extends roof life by years.",
        step: 5,
        dotX: 490, dotY: 70, textX: 210, textY: 58, lineEndX: 220, side: "left", threshold: 0.56,
      },
      {
        name: "ARCHITECTURAL SHINGLES",
        description:
          "Beautiful dimensional shingles — the striking, visible heart of your roofing system. Available in dozens of colors to match any taste or home, and built for decades of dependable protection.",
        step: 4,
        dotX: 720, dotY: 137, textX: 1080, textY: 187, lineEndX: 1070, side: "right", threshold: 0.43,
      },
      {
        name: "STARTER STRIP SHINGLES",
        description:
          "Premium pre-cut strips create the first sealed row at the eaves. Locks every shingle above firmly in place, preventing blow-offs.",
        step: 3,
        dotX: 620, dotY: 210, textX: 210, textY: 322, lineEndX: 220, side: "left", threshold: 0.30,
      },
      {
        name: "LEAK BARRIER",
        description:
          "Self-adhering rubberized membrane along vulnerable eaves and valleys. Stops ice dams and wind-driven rain dead in their tracks.",
        step: 2,
        dotX: 720, dotY: 235, textX: 1080, textY: 335, lineEndX: 1070, side: "right", threshold: 0.17,
      },
      {
        name: "ROOF DECK PROTECTION",
        description:
          "Synthetic underlayment is your roof's foundation. Protects your home from water and weather before shingles are even installed.",
        step: 1,
        dotX: 430, dotY: 140, textX: 210, textY: 190, lineEndX: 220, side: "left", threshold: 0.04,
      },
    ] satisfies RoofLabel[],
  },

  shingles: {
    eyebrow: "THE BORDI SYSTEM",
    heading: "18 Authentic Colors. One Standard of Quality.",
    subhead:
      "Every GAF Timberline HDZ shingle is engineered to the same lifetime-rated specification. The only thing that changes is the character of your home.",
    // `name` (uppercase) is the favorite identifier; `file` is the basename in
    // /public/images.
    colors: [
      { name: "OYSTER GRAY", file: "01-oyster-gray" },
      { name: "PEWTER GRAY", file: "02-pewter-gray" },
      { name: "FOX HOLLOW GRAY", file: "03-fox-hollow-gray" },
      { name: "SLATE", file: "04-slate" },
      { name: "WILLIAMSBURG SLATE", file: "05-williamsburg-slate" },
      { name: "BISCAYNE BLUE", file: "06-biscayne-blue" },
      { name: "WEATHERED WOOD", file: "07-weathered-wood" },
      { name: "CLIFFSIDE", file: "08-cliffside" },
      { name: "MIDNIGHT MESA", file: "09-midnight-mesa" },
      { name: "CHARCOAL", file: "10-charcoal" },
      { name: "HUNTER GREEN", file: "11-hunter-green" },
      { name: "PATRIOT RED", file: "12-patriot-red" },
      { name: "SIERRA SAND", file: "13-sierra-sand" },
      { name: "BARKWOOD", file: "14-barkwood" },
      { name: "SHAKEWOOD", file: "15-shakewood" },
      { name: "HICKORY", file: "16-hickory" },
      { name: "MISSION BROWN", file: "17-mission-brown" },
      { name: "CHESTNUT VALLEY", file: "18-chestnut-valley" },
    ] satisfies ShingleColor[],
  },

  features: {
    heading: "Anatomy of a Premium Roof",
    subhead: "Every layer matters. Here's what's protecting your home.",
    items: [
      {
        icon: Shield,
        title: "Roof Deck Protection",
        description:
          "Synthetic underlayment forms the foundation. Protects your home from water infiltration before shingles are even installed.",
      },
      {
        icon: Droplets,
        title: "Leak Barrier",
        description:
          "Rubberized membrane seals high-risk areas like eaves and valleys. Stops ice dams and wind-driven rain in their tracks.",
      },
      {
        icon: Layers,
        title: "Starter Strip Shingles",
        description:
          "Premium pre-cut strips create the first sealed row. Eliminates blow-offs and ensures every shingle above sits perfectly.",
      },
      {
        icon: Home,
        title: "Architectural Shingles",
        description:
          "Dimensional charcoal shingles deliver curb appeal and decades of protection. The visible heart of your roofing system.",
      },
      {
        icon: Wind,
        title: "Cobra Ridge Vent",
        description:
          "Continuous attic ventilation regulates temperature and moisture. Extends your roof's life by years.",
      },
      {
        icon: Crown,
        title: "Ridge Cap Shingles",
        description:
          "Premium ridge caps seal the peak. The finishing touch that protects against wind and water at the most vulnerable spot on your roof.",
      },
    ] satisfies FeatureItem[],
  },

  whyChooseUs: {
    heading: "Built on Trust. Backed by GAF.",
    reasons: [
      {
        icon: Award,
        title: "GAF Master Elite Certified",
        description:
          "Fewer than 2% of roofers earn GAF's top certification — meaning our work meets the manufacturer's strictest standards and unlocks GAF's best warranties.",
      },
      {
        icon: ShieldCheck,
        title: "Lifetime Material Warranty",
        description:
          "Every roof we install comes with GAF's full lifetime warranty on shingles and materials. If something fails, it's on us and the manufacturer — never on you.",
      },
      {
        icon: Users,
        title: "Family-Owned & Operated",
        description:
          "A New Jersey family business where the owner answers the phone and shows up to every job site. The name on the truck is the name on the line.",
      },
    ] satisfies Reason[],
  },

  testimonials: {
    eyebrow: "TRUSTED BY HOMEOWNERS",
    heading: "See Why Families Choose Bordi & Sons With Confidence",
    subhead:
      "Real reviews from New Jersey homeowners who trusted us with their roof — and would do it again.",
    columnA: [
      {
        quote:
          "Honestly the easiest contractor experience we've had. They showed up exactly when they said, cleaned up every last nail, and the roof looks incredible.",
        name: "Maria DeLuca",
        town: "Haddon Twp",
      },
      {
        quote:
          "A Bordi was on the job every single day. You can tell it's a real family business — they actually care how the work turns out.",
        name: "Tom Reynolds",
        town: "Cherry Hill",
      },
      {
        quote:
          "Got three quotes and Bordi & Sons was the only one who walked me through every layer of the roof. No pressure, just straight answers.",
        name: "Priya Nair",
        town: "Collingswood",
      },
      {
        quote:
          "A storm took half our shingles off. They had us tarped and fully repaired faster than anyone else could even schedule an estimate.",
        name: "Greg Halloran",
        town: "Voorhees",
      },
    ] satisfies Testimonial[],
    columnB: [
      {
        quote:
          "The crew was respectful, on time, and the cleanup was spotless. My new roof looks even better than I imagined it would.",
        name: "Danielle Foster",
        town: "Moorestown",
      },
      {
        quote:
          "From the estimate to the final walkthrough everything was clear and upfront. Not a single surprise charge at the end.",
        name: "Kevin Marsh",
        town: "Marlton",
      },
      {
        quote:
          "We love our new roof. The whole team was professional and the workmanship is top-notch. Highly recommend Bordi & Sons to anyone.",
        name: "Sarah Whitman",
        town: "Haddonfield",
      },
      {
        quote:
          "They treated my home like it was their own. Quality materials, a fair price, and a warranty that actually means something.",
        name: "Anthony Russo",
        town: "Audubon",
      },
    ] satisfies Testimonial[],
  },

  faq: {
    eyebrow: "FREQUENTLY ASKED",
    heading: "Questions? We've got answers.",
    subhead: "Straight answers to what homeowners ask us most.",
    items: [
      {
        q: "How much does a new roof cost?",
        a: "It depends on the size and pitch of your roof and the materials you choose, so the honest answer is that we'll give you a real number after a free, no-obligation inspection. We walk you through every line item up front — no surprise charges after the contract is signed.",
      },
      {
        q: "How long does a roof replacement take?",
        a: "Most homes are completely torn off and re-roofed in one to two days. Larger or more complex roofs can take a little longer, but we'll give you a clear timeline before we start and keep you updated throughout.",
      },
      {
        q: "What warranty comes with my roof?",
        a: "As a GAF Master Elite contractor, every roof we install is backed by GAF's lifetime material warranty, plus our own workmanship warranty. If something isn't right, it's on us and the manufacturer — never on you.",
      },
      {
        q: "Do you help with storm damage and insurance claims?",
        a: "Yes. We inspect the damage, document everything your insurer needs, and walk you through the claims process so you're not navigating it alone. We've helped many neighbors get the coverage they were owed after a storm.",
      },
      {
        q: "Do I need a full replacement, or can my roof be repaired?",
        a: "Not every roof needs to be replaced. After a free inspection we'll give you a straight assessment — if a repair will genuinely solve the problem, that's what we'll recommend. We'd rather earn your trust than oversell you.",
      },
    ] satisfies QA[],
  },
} as const;
