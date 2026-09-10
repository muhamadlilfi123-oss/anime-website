'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGenreAnime, extractList } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Pagination from '@/components/Pagination';
import { AnimeGridSkeleton } from '@/components/LoadingSkeleton';

export default function GenreDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getGenreAnime(slug, page)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const genreName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';
  const animeList = extractList(data);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
        Genre: {genreName}
      </h1>

      {error && (
        <div className="text-center py-12">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <AnimeGridSkeleton />
      ) : animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime: any, index: number) => (
              <AnimeCard
                key={anime?.slug || index}
                title={anime?.title || anime?.name}
                slug={anime?.slug}
                poster={anime?.poster || anime?.thumb || anime?.image}
                episode={anime?.episode}
                score={anime?.score}
                status={anime?.status}
                type={anime?.type}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            onPageChange={handlePageChange}
            hasNext={data?.pagination?.has_next ?? data?.next_page ?? true}
          />
        </>
      ) : (
        <p className="text-gray-500 text-center py-12">Tidak ada anime ditemukan untuk genre ini.</p>
      )}
    </div>
  );
}
