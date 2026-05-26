import type { Metadata } from "next";
import { getAllEntries, pageCount, pageSlice } from "@/lib/content";
import { PostList } from "@/components/blog/PostList";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/es/blog" },
};

export default function BlogIndexEs() {
  const all = getAllEntries("blog", "es");
  return (
    <PostList
      entries={pageSlice(all, 1)}
      locale="es"
      page={1}
      totalPages={pageCount(all.length)}
    />
  );
}
