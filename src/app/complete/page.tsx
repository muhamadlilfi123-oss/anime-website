'use client';

import { useEffect, useState } from 'react';
import { getComplete, extractList, extractSlug } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Pagination from '@/components/Pagination';
import { AnimeGridSkeleton } from '@/components/LoadingSkeleton';

export default function CompletePage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getComplete(page)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const animeList = extractList(data);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1 h-8 bg-green-500 rounded-full"></span>
        Complete Anime
      </h1>

      {error && (
        <div className="text-center py-12">
          <p className="text-red-400">⚠️ {error}</p>
          <button onClick={() => setPage(page)} className="mt-4 px-6 py-2 bg-primary rounded-lg hover:bg-accent transition-colors">Coba Lagi</button>
        </div>
      )}

      {loading ? (
        <AnimeGridSkeleton />
      ) : animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime: any, index: number) => {
              const slug = extractSlug(anime);
              return (
                <AnimeCard
                  key={slug || index}
                  title={anime?.title || anime?.name}
                  slug={slug}
                  poster={anime?.poster || anime?.thumb || anime?.image}
                  episode={anime?.total_episode || anime?.episode}
                  score={anime?.score}
                  status="Complete"
                  type={anime?.type}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={page}
            onPageChange={handlePageChange}
            hasNext={data?.pagination?.has_next ?? data?.next_page ?? true}
          />
        </>
      ) : (
        <p className="text-gray-500 text-center py-12">Tidak ada anime complete ditemukan.</p>
      )}
    </div>
  );
}
