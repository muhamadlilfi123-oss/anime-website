export function AnimeCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 aspect-[3/4] skeleton rounded-xl" />
        <div className="flex-1 space-y-4">
          <div className="h-8 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/4" />
          <div className="h-4 skeleton rounded w-1/3" />
          <div className="space-y-2 mt-6">
            <div className="h-3 skeleton rounded w-full" />
            <div className="h-3 skeleton rounded w-full" />
            <div className="h-3 skeleton rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EpisodeSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="aspect-video skeleton rounded-xl" />
      <div className="h-8 skeleton rounded w-2/3" />
      <div className="h-4 skeleton rounded w-1/3" />
    </div>
  );
}
