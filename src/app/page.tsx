'use client';

import { useEffect, useState } from 'react';
import { getHome } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import { AnimeGridSkeleton } from '@/components/LoadingSkeleton';
import Link from 'next/link';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHome()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">⚠️ Gagal memuat data</p>
          <p className="text-gray-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-primary rounded-lg hover:bg-accent transition-colors">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const getAnimeList = (val: any): any[] => {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') {
      if (Array.isArray(val.anime)) return val.anime;
      if (Array.isArray(val.data)) return val.data;
      if (Array.isArray(val.ongoing)) return val.ongoing;
      if (Array.isArray(val.complete)) return val.complete;
      if (Array.isArray(val.animeList)) return val.animeList;
      if (Array.isArray(val.anime_list)) return val.anime_list;
    }
    return [];
  };

  const ongoingList = getAnimeList(data?.ongoing || data?.data?.ongoing || data?.data || data?.anime);
  const completeList = getAnimeList(data?.complete || data?.data?.complete);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
            AnimeVault
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Nonton anime subtitle Indonesia terlengkap dan terupdate
        </p>
      </section>

      {/* Ongoing Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            Ongoing Anime
          </h2>
          <Link href="/ongoing" className="text-primary hover:text-accent text-sm font-medium transition-colors">
            Lihat Semua →
          </Link>
        </div>
        {loading ? (
          <AnimeGridSkeleton count={12} />
        ) : ongoingList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {ongoingList.map((anime: any, index: number) => (
              <AnimeCard
                key={anime?.slug || index}
                title={anime?.title || anime?.name}
                slug={anime?.slug}
                poster={anime?.poster || anime?.thumb || anime?.image}
                episode={anime?.current_episode || anime?.episode}
                score={anime?.score}
                type={anime?.type}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">Tidak ada anime ongoing ditemukan.</p>
        )}
      </section>

      {/* Complete Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-1 h-8 bg-green-500 rounded-full"></span>
            Complete Anime
          </h2>
          <Link href="/complete" className="text-primary hover:text-accent text-sm font-medium transition-colors">
            Lihat Semua →
          </Link>
        </div>
        {loading ? (
          <AnimeGridSkeleton count={12} />
        ) : completeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {completeList.map((anime: any, index: number) => (
              <AnimeCard
                key={anime?.slug || index}
                title={anime?.title || anime?.name}
                slug={anime?.slug}
                poster={anime?.poster || anime?.thumb || anime?.image}
                episode={anime?.total_episode || anime?.episode}
                score={anime?.score}
                status="Complete"
                type={anime?.type}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">Tidak ada anime complete ditemukan.</p>
        )}
      </section>
    </div>
  );
}
