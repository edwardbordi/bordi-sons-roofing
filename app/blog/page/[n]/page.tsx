import { notFound } from "next/navigation";
import { getAllEntries, pageCount, pageSlice } from "@/lib/content";
import { PostList } from "@/components/blog/PostList";

export function generateStaticParams() {
  const total = pageCount(getAllEntries("blog", "en").length);
  // Page 1 lives at /blog; only generate 2..total here.
  return Array.from({ length: total }, (_, i) => i + 1)
    .filter((n) => n >= 2)
    .map((n) => ({ n: String(n) }));
}

export default async function BlogPaginated({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = Number(n);
  const all = getAllEntries("blog", "en");
  const total = pageCount(all.length);
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();
  return (
    <PostList
      entries={pageSlice(all, page)}
      locale="en"
      page={page}
      totalPages={total}
    />
  );
}
