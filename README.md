# F1 News Hub 🏎️

F1 News Hub is a small Next.js app that aggregates Formula 1 news from multiple reliable sources into a single, clean feed.

It pulls headlines via RSS, normalises the data server-side, and always links back to the original articles.

## Features

- Aggregates F1 news from multiple sources (e.g. Formula1.com, Autosport, RaceFans)
- Server-side RSS fetching and caching
- Source filtering (enabled by default, toggle to exclude)
- Search with instant filtering and clear button
- Responsive 3-column / masonry-style layout
- Article images with sensible fallbacks per source
- No scraping of full article content

## Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **rss-parser**

## Getting started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm install
````

### Run the development server

```bash
npm run dev
```

Then open:

```url
http://localhost:3000
```

## How it works

- RSS feeds are fetched server-side in an API route
- Items are normalised into a common format
- Images are extracted from RSS media fields or embedded HTML
- Per-feed default images are used when no item image exists
- Results are cached in-memory for a short time to avoid hammering feeds

## Notes

- Some feeds (e.g. RaceFans) do not provide per-article images in RSS — defaults are used instead
- Some feeds (e.g. Formula1.com) do not include publish dates in RSS
- This project is intended for personal use / learning

## Future ideas

- Dark mode
- Saved filters
- Article tags (Tech / Race / Opinion)
- Background revalidation / cron refresh
- Optional Open Graph image fetching

---

Built for fun and learning. Always click through and support the original publishers.
