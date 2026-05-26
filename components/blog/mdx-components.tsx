import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  OlHTMLAttributes,
} from "react";

/**
 * Styled element map for MDX-rendered post bodies (audit H2). Markdown elements
 * render with these instead of unstyled defaults. Brand links use the semantic
 * primary token (CLAUDE.md §4).
 */
export const mdxComponents = {
  h2: (p: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 mb-3 text-2xl font-bold text-slate-900" {...p} />
  ),
  h3: (p: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 mb-2 text-xl font-semibold text-slate-900" {...p} />
  ),
  p: (p: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed text-slate-700" {...p} />
  ),
  ul: (p: HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 list-disc space-y-1 pl-6 text-slate-700" {...p} />
  ),
  ol: (p: OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 list-decimal space-y-1 pl-6 text-slate-700" {...p} />
  ),
  li: (p: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...p} />
  ),
  a: ({ href = "#", ...p }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
      {...p}
    />
  ),
};
