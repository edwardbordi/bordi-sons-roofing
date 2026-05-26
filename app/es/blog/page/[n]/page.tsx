import { notFound } from "next/navigation";
import { getAllEntries, pageCount, pageSlice } from "@/lib/content";
import { PostList } from "@/components/blog/PostList";

export function generateStaticParams() {
  const total = pageCount(getAllEntries("blog", "es").length);
  return Array.from({ length: total }, (_, i) => i + 1)
    .filter((n) => n >= 2)
    .map((n) => ({ n: String(n) }));
}

export default async function BlogPaginatedEs({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = Number(n);
  const all = getAllEntries("blog", "es");
  const total = pageCount(all.length);
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();
  return (
    <PostList
      entries={pageSlice(all, page)}
      locale="es"
      page={page}
      totalPages={total}
    />
  );
}
