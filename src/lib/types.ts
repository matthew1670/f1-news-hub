export type NewsItem = {
  id: string;          // stable id (hash-like)
  sourceId: string;    // e.g. "f1"
  sourceName: string;  // e.g. "Formula1.com"
  title: string;
  url: string;
  publishedAt: string; // ISO string
  summary?: string;
  image?: string;
};
