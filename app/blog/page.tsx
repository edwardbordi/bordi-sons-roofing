import type { Metadata } from "next";
import { getAllEntries, pageCount, pageSlice } from "@/lib/content";
import { PostList } from "@/components/blog/PostList";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const all = getAllEntries("blog", "en");
  return (
    <PostList
      entries={pageSlice(all, 1)}
      locale="en"
      page={1}
      totalPages={pageCount(all.length)}
    />
  );
}
