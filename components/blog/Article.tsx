import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";
import { getAuthor, type ContentEntry } from "@/lib/content";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/** Renders one post (audit H2). Server component (reads author via fs). */
export function Article({ entry }: { entry: ContentEntry }) {
  const fm = entry.frontmatter;
  const author = getAuthor(fm.author);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {entry.isFallback && (
        <div className="mb-6 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
          Shown in English — a translation is coming soon.
        </div>
      )}

      {fm.category && (
        <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase">
          {fm.category}
        </p>
      )}
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
        {fm.title}
      </h1>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        {author && <span className="font-medium text-slate-700">{author.name}</span>}
        {author && <span aria-hidden="true">·</span>}
        <time dateTime={fm.date}>{fmtDate(fm.date)}</time>
      </div>

      {fm.hero && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={fm.hero}
            alt=""
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8">
        <MDXRemote source={entry.body} components={mdxComponents} />
      </div>
    </article>
  );
}
