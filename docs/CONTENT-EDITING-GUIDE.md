# Content Editing Guide (for non-developers)

You can add and edit blog posts entirely in your browser through GitHub — no code,
no setup. Every change is previewed before it goes live, and publishing is just
merging a pull request.

## Add a blog post (GitHub web UI)

1. Go to the repo → open the **`content/blog`** folder.
2. Click **Add file → Create new file**.
3. Name it with lowercase words and dashes, ending in `.mdx`, e.g.
   `spring-roof-maintenance.mdx`.
4. Paste this template at the top and fill it in:
   ```mdx
   ---
   title: "Your Headline Here"
   description: "One or two sentences for search results (max 160 chars)."
   date: "2026-06-01"
   author: "ed-bordi"
   category: "Roof Maintenance"
   tags: ["maintenance", "tips"]
   draft: true
   hero: "/images/hero-scene.jpg"
   ---

   Write your post here in plain text.

   ## A section heading

   More text. You can **bold**, *italicize*, and [link](https://example.com).
   ```
5. Keep `draft: true` while you're writing.
6. Scroll down → **Commit changes** → choose **"Create a new branch and start a
   pull request"** → **Propose changes**.

## Add an image

1. In the PR's branch, open (or create) the folder **`public/blog/your-post-slug/`**.
2. **Add file → Upload files**, drag your image in, commit.
3. Reference it in the post: `![Description](/blog/your-post-slug/photo.jpg)` or set
   `hero: "/blog/your-post-slug/photo.jpg"` in the frontmatter.

> Tip: use reasonably sized images (≤ ~1600px wide). The site optimizes delivery,
> but smaller originals keep the repo lean.

## Preview it

When you open the PR, **Vercel posts a preview link** as a comment within a minute
or two. Click it to see your post live (drafts show in previews). The preview
updates every time you commit.

## Publish

1. When it's ready, edit the post and change `draft: true` → `draft: false`.
2. Get a quick review (and the automated checks must pass).
3. **Merge** the pull request. The site rebuilds and your post is live in a couple
   of minutes.

## Spanish version (optional)

Duplicate the file with `.es.mdx` (e.g. `spring-roof-maintenance.es.mdx`) and
translate the text. If you don't, the Spanish site automatically shows the English
version with a small "translation coming soon" note.

## What NOT to put in a post

Don't hardcode the phone number, email, or address in copy — those come from the
site config and stay consistent everywhere. If something's wrong there, ask a
developer to update `config/site.config.ts`.

See also: [ADDING-A-BLOG-POST.md](ADDING-A-BLOG-POST.md) (the developer version).
