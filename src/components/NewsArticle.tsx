import Image from "next/image";
import type { NewsItem } from "@/lib/types";

export default function NewsArticle({ article }: { article: NewsItem }) {

    return (
        <article className="cursor-pointer break-inside-avoid mb-6 group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg hover:border-zinc-200 focus-within:ring-2 focus-within:ring-black/10">
            <a href={article.url} target="_blank" rel="noreferrer">
                {article.image && (
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                        <Image
                            src={article.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            loading="lazy"
                            onError={(e) => {
                                const wrapper = e.currentTarget.parentElement;
                                if (wrapper) wrapper.style.display = "none";
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 from-black/30 via-black/0 to-black/0" />
                    </div>
                )}

                <div className="p-4 space-y-2">
                    <div className="news-item-meta">
                        <span className="meta-badge">{article.sourceName}</span>
                        <span className="meta-sep">•</span>

                        {article.publishedAt && article.sourceId !== "f1" ? (
                            <time className="news-item-date" dateTime={article.publishedAt}>
                                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </time>
                        ) : (
                            <span className="news-item-date">Undated</span>
                        )}
                    </div>
                    <h2 className="news-item-title">
                        {article.title}
                    </h2>
                    {article.summary && <p className="news-item-summary">{article.summary}</p>}
                </div>
            </a>
        </article>
    );
}
