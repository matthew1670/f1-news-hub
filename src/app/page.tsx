import FeedPageClient from "@/components/FeedPageClient";
import type { NewsItem } from "@/lib/types";

async function getItems(): Promise<NewsItem[]> {
  if (!process.env.NEXT_PUBLIC_API_BASE) throw new Error("API base URL not set");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/items`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as NewsItem[];
}

export default async function Page() {
  const items = await getItems();
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 min-h-screen">
      <FeedPageClient items={items} />
    </main>
  );
}
