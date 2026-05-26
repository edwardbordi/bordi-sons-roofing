import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, getSlugs } from "@/lib/content";
import { Article } from "@/components/blog/Article";

export function generateStaticParams() {
  return getSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("blog", slug, "es");
  if (!entry) return {};
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    alternates: { canonical: entry.frontmatter.canonical ?? `/es/blog/${slug}` },
  };
}

export default async function BlogPostPageEs({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry("blog", slug, "es");
  if (!entry) notFound();
  return <Article entry={entry} />;
}
