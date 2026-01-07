import Image from "next/image";
import type { NewsItem } from "@/lib/types";

export default function NewsArticle({ article, isFeatured }: { article: NewsItem; isFeatured?: boolean }) {
  const dateLabel =
    article.publishedAt && article.sourceId !== "f1"
      ? new Date(article.publishedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Undated";

  return (
    <article className={` ${ isFeatured ? 'col-span-2 row-span-2' : '' } break-inside-avoid mb-6 group relative overflow-hidden rounded-2xl border bg-black shadow-sm transition hover:shadow-lg hover:border-zinc-200 focus-within:ring-4 focus-within:ring-black/80 ${isFeatured ? "lg:col-span-2" : ""}`}>
      {/* Image area becomes the whole card */}
      <div className="relative w-full aspect-[16/10] bg-zinc-200">
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}

        {/* Readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />

        {/* Clickable overlay (nice big hit-area) */}
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label={article.title}
        />

        {/* Top-left meta */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-900">
            {article.sourceName}
          </span>
          <span className="text-xs text-white">{dateLabel}</span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="text-balance text-lg font-semibold leading-snug text-white">
            {article.title}
          </h2>

          {/* Optional: keep summary, but clamp it so it doesn’t take over
          {article.summary ? (
            <p className="mt-2 line-clamp-2 text-sm text-white/80">
              {article.summary}
            </p>
          ) : null} */}

          <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/90">
            Read original <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </article>
  );
}
