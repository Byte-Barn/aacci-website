# AACCI website

The website of the **Asian-African Chamber of Commerce & Industry (AACCI)**, built with Next.js as a fully static site. It replaces the WordPress site at asianafrican.org and is intended for **asianafricanmission.org**. It is currently published at https://byte-barn.github.io/aacci-website/.

`next build` writes plain HTML, CSS, JavaScript and files to `out/`. Any static host can serve it. No server is needed.

## Contents

- **Pages:** home, about, leadership, chapters, membership, services, events, news, contact, careers, policies, search, thanks and 404.
- **News:** 447 article pages, generated from the exported WordPress posts.
- **Interactive parts:**
  - a halftone map of Asia and Africa with routes from the Global Secretariat to every chapter, with region filters and tooltips
  - a membership fee finder
  - a searchable advisory board directory
  - the news archive, with region filters, search and "show more"
  - an event photo gallery: album decks, a masonry wall, and a full-screen viewer with filmstrip, swipe, keyboard control and slideshow
  - a pinned events timeline
  - site-wide search (press `/` or Ctrl+K)
- **Motion:** headline reveals, counters, route drawing, and hover tilt with a three-stripe sweep on images. Everything is switched off when the visitor's system asks for reduced motion.

## For search engines and crawlers

All content is in the static HTML, so it can be read without JavaScript. Every page also has:

- a title, description and canonical URL
- Open Graph and Twitter cards
- a breadcrumb trail, plus JSON-LD structured data

Structured data by page:

| Page | Schema |
| --- | --- |
| Every page | Organization |
| Home | WebSite with SearchAction |
| Articles | NewsArticle |
| Events | Events |
| Leadership | People |

Generated files:

| File | Contents |
| --- | --- |
| `sitemap.xml` | All pages and articles, with images |
| `robots.txt` | Open to all crawlers |
| `news/feed.xml` | RSS feed |
| `llms.txt` | Plain-text guide for AI crawlers |
| `manifest.webmanifest` | Web app manifest |
| icons | Site icons |

The news page links every article in a browse-by-month archive. Old WordPress addresses on asianafrican.org redirect to the matching new pages through `public/_redirects` (760 rules).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
npm start          # serve out/ locally
npm run lint && npm run typecheck
```

Node 20.9 or newer.

## Project structure

```
src/app/                 routes (App Router), sitemap, robots, manifest, RSS, search index, llms.txt
src/components/ui.tsx    shared server components (headings, page hero, news card, partners, CTA)
src/components/client/   interactive components (header, search, map, gallery, forms, widgets)
src/content/data.ts      hand-maintained content: contacts, services, membership, events, chapters, people
src/content/*.json       generated content: news, council and advisory board, policies, albums, map
src/lib/                 content loaders, SEO helpers, formatting
src/styles/              design system (main.css), page components (pages.css), Next.js additions (next.css)
public/img/              optimised images (WebP)
content/raw/             content exported from asianafrican.org (source for src/content)
scripts/                 Python tools: content export, map generation, image optimisation
```

## Updating content

- **Contacts, services, fees, events, chapters and people:** edit `src/content/data.ts`.
- **News, policies, council and advisory board:** update `content/raw/*.json`, then run `npm run content`. This regenerates `src/content/*.json` and `public/_redirects`.
- **The map:** places are listed in `scripts/build_map.py`. Run `npm run map` after changing them. Land outlines come from Natural Earth 1:50m (public domain).
- **Images:** the tools in `scripts/` turn originals into WebP files. News images go in `content/raw/news-images/news__<post id>.<ext>` and are picked up by `npm run content`.

The scripts need Python 3.10+ and Pillow (`pip install pillow`). They only run when content changes, never in the site build.

## Forms

The membership, contact, careers and newsletter forms are set up for **Netlify Forms**. Netlify detects them in the exported HTML. Each form has a honeypot field, and posts to `/thanks/` when JavaScript is off.

To use Formspree instead, build with `NEXT_PUBLIC_FORMS_PROVIDER=formspree:<form id>`. All four forms then post to that one Formspree form, each with its own subject line. The GitHub Pages deploy takes this from the repository variable `FORMS_PROVIDER`. The careers form sends a CV, and Formspree only accepts file uploads on its paid plans.

On `localhost`, forms only show a preview message and send nothing.

## Deployment

The site is published to **GitHub Pages** at https://byte-barn.github.io/aacci-website/ by GitHub Actions (`.github/workflows/ci.yml`). Every pull request is linted, type-checked and built. Every push to `main` is also published.

- **Sub-path:** on GitHub Pages the site is served under `/aacci-website`, not at the root of a domain. The build reads the address from the repository's Pages settings and passes it in as `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL`. Adding a custom domain in those settings needs no code change.
- **Writing paths:** `next/link` adds the sub-path by itself. Every image, plain `<a>`, `fetch` and form action must go through `asset()` from `src/lib/base.ts`, or it will break under the sub-path. Full addresses for metadata come from `abs()` in `src/lib/seo.ts`.
- **Not available on GitHub Pages:** the redirects in `public/_redirects`, the headers in `public/_headers`, and Netlify Forms. The forms use Formspree here (see Forms above).

To build locally the way the deploy does: `NEXT_PUBLIC_BASE_PATH=/aacci-website NEXT_PUBLIC_SITE_URL=https://byte-barn.github.io/aacci-website npm run build`.

`netlify.toml` is kept so the site can also be built and published on Netlify.

Content corrections made against the current site, and open questions for the chamber, are listed in [docs/content-audit.md](docs/content-audit.md).
