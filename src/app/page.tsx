import FeedClient from "@/components/FeedClient";
import type { NewsItem } from "@/lib/types";

async function getItems(): Promise<NewsItem[]> {
  const res = await fetch("/api/items", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as NewsItem[];
}

export default async function Page() {
  const items = await getItems();
  return <FeedClient items={items} />;
}
