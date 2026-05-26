#!/usr/bin/env node
/**
 * Drift detection (audit H7). Catches violations of the CLAUDE.md "never
 * hardcode" rules in component/app code, and warns on EN/ES content gaps.
 *
 * Hard failures (exit 1):
 *  - Literal brand-color utility classes (red / green) outside config/globals.
 *  - Brand color hexes used as literals in components/app.
 *  - Hardcoded business info (phone / mailto / business domain / estimate URL)
 *    in components/app — must come from config/site.config.ts.
 *
 * Soft warnings (do not fail): a post missing its .es.mdx counterpart.
 *
 * Frontmatter validity + sitemap coverage are enforced by `next build` (the
 * content loader validates with zod and the sitemap is generated from content).
 */
import fs from "node:fs";

const codeGlobs = ["components/**/*.tsx", "app/**/*.{ts,tsx}"];
const files = codeGlobs.flatMap((g) => fs.globSync(g));

const RULES = [
  {
    id: "brand-color-class",
    desc: "literal brand-color class (use bg-primary-*/text-accent-*)",
    re: /\b(?:bg|text|ring|border|fill|stroke|from|to|via|outline|decoration|divide)-(?:red|green)-\d{2,3}\b/,
  },
  {
    id: "brand-hex",
    desc: "literal brand hex (import from config/brand.config.ts)",
    re: /#(?:dc2626|b91c1c|1a7f45|15803d)\b/i,
  },
  {
    id: "business-phone",
    desc: "hardcoded phone (use site.config.ts)",
    re: /\(\d{3}\)\s?\d{3}-\d{4}|tel:\+\d/,
  },
  {
    id: "business-contact",
    desc: "hardcoded email/domain/estimate URL (use site.config.ts)",
    // `mailto:${site.email}` (config-driven) is fine; only flag literal mailto.
    re: /mailto:(?!\$\{)|bordiandsons\.com|demo\.sitescan\.controlsuite\.ai/,
  },
];

const violations = [];
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) return; // skip comments
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        violations.push({ file, line: i + 1, rule: rule.id, desc: rule.desc, text: line.trim().slice(0, 100) });
      }
    }
  });
}

// Soft: EN/ES parity for blog content.
const warnings = [];
const blogDir = "content/blog";
if (fs.existsSync(blogDir)) {
  const all = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  const bases = all.filter((f) => !/\.[a-z]{2}\.mdx$/.test(f)).map((f) => f.replace(/\.mdx$/, ""));
  for (const base of bases) {
    if (!all.includes(`${base}.es.mdx`)) warnings.push(`content/blog/${base}.mdx has no .es.mdx translation`);
  }
}

const score = violations.length;
console.log(`Drift score: ${score} violation(s), ${warnings.length} warning(s)\n`);

if (violations.length) {
  console.log("Violations (must fix):");
  for (const v of violations) console.log(`  ✗ ${v.file}:${v.line} [${v.rule}] ${v.desc}\n      ${v.text}`);
  console.log("");
}
if (warnings.length) {
  console.log("Warnings (non-blocking):");
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  console.log("");
}
if (score === 0) console.log("✓ No drift. Standards held.");

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  const md =
    `### Drift report\n\n**Score: ${score} violation(s), ${warnings.length} warning(s)**\n\n` +
    (violations.length ? violations.map((v) => `- ✗ \`${v.file}:${v.line}\` — ${v.desc}`).join("\n") : "- ✓ No violations") +
    (warnings.length ? `\n\n_Warnings:_\n` + warnings.map((w) => `- ⚠ ${w}`).join("\n") : "");
  fs.appendFileSync(summary, md + "\n");
}

process.exit(score > 0 ? 1 : 0);
