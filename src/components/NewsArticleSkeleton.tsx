export default function NewsArticleSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative h-44 w-full bg-zinc-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-zinc-200 animate-pulse" />
        <div className="h-4 w-full rounded-full bg-zinc-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded-full bg-zinc-200 animate-pulse" />
      </div>
    </div>
  );
}
