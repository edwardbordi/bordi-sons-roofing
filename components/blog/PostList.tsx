import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { ContentEntry } from "@/lib/content";
import type { Locale } from "@/config/site.config";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/** Blog index / paginated listing (audit H2). */
export function PostList({
  entries,
  locale,
  page,
  totalPages,
}: {
  entries: ContentEntry[];
  locale: Locale;
  page: number;
  totalPages: number;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        Blog
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        Roofing tips and straight answers from our team.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <Link
            key={e.slug}
            href={localizePath(`/blog/${e.slug}`, locale)}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {e.frontmatter.category && (
              <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
                {e.frontmatter.category}
              </p>
            )}
            <h2 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-primary-700">
              {e.frontmatter.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">
              {e.frontmatter.description}
            </p>
            <time
              dateTime={e.frontmatter.date}
              className="mt-3 block text-xs text-slate-400"
            >
              {fmtDate(e.frontmatter.date)}
            </time>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? localizePath("/blog", locale) : localizePath(`/blog/page/${n}`, locale)}
              aria-current={n === page ? "page" : undefined}
              className={
                "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium " +
                (n === page
                  ? "bg-primary-600 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50")
              }
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
