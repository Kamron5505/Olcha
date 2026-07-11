export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton-shimmer rounded w-full" />
        <div className="h-4 skeleton-shimmer rounded w-3/4" />
        <div className="h-5 skeleton-shimmer rounded w-1/2 mt-2" />
        <div className="h-9 skeleton-shimmer rounded-lg mt-2" />
      </div>
    </div>
  );
}
