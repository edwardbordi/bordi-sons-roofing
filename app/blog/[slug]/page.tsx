import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, getSlugs, getAuthor } from "@/lib/content";
import { Article } from "@/components/blog/Article";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, blogPostingLd, personLd, breadcrumbLd } from "@/lib/seo";

const LOCALE = "en" as const;

export function generateStaticParams() {
  return getSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("blog", slug, LOCALE);
  if (!entry) return {};
  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    path: `/blog/${slug}`,
    locale: LOCALE,
    image: entry.frontmatter.hero,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry("blog", slug, LOCALE);
  if (!entry) notFound();
  const fm = entry.frontmatter;
  const author = getAuthor(fm.author);

  return (
    <>
      <JsonLd
        data={blogPostingLd({
          title: fm.title,
          description: fm.description,
          path: `/blog/${slug}`,
          locale: LOCALE,
          datePublished: fm.date,
          dateModified: fm.updated,
          image: fm.hero,
          author,
        })}
      />
      {author && <JsonLd data={personLd(author)} />}
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: fm.title, path: `/blog/${slug}` },
          ],
          LOCALE
        )}
      />
      <Article entry={entry} />
    </>
  );
}
