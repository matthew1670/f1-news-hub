import FeedClient from "@/components/FeedClient";
import type { NewsItem } from "@/lib/types";

async function getItems(): Promise<NewsItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/items`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as NewsItem[];
}

export default async function Page() {
  const items = await getItems();
  return <FeedClient items={items} />;
}
