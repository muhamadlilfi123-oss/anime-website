'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAnimeDetail } from '@/lib/api';
import Link from 'next/link';
import { DetailSkeleton } from '@/components/LoadingSkeleton';

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getAnimeDetail(slug)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">⚠️ Gagal memuat data anime</p>
          <p className="text-gray-500">{error}</p>
          <Link href="/" className="mt-4 inline-block px-6 py-2 bg-primary rounded-lg hover:bg-accent transition-colors">Kembali ke Home</Link>
        </div>
      </div>
    );
  }

  const anime = data?.data || data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Anime Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-72 flex-shrink-0">
          <img
            src={anime?.poster || anime?.thumb || ''}
            alt={anime?.title || ''}
            className="w-full rounded-xl shadow-2xl shadow-primary/10"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-white">
            {anime?.title}
          </h1>
          {anime?.japanese && (
            <p className="text-gray-400 text-sm mb-4 italic">{anime.japanese}</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {anime?.score && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-400">Score:</span>
                <span className="text-white font-semibold">{anime.score}</span>
              </div>
            )}
            {anime?.status && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400">●</span>
                <span className="text-gray-400">Status:</span>
                <span className="text-white font-semibold">{anime.status}</span>
              </div>
            )}
            {anime?.type && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-400">📺</span>
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold">{anime.type}</span>
              </div>
            )}
            {(anime?.total_episode || anime?.episodes) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-400">🎬</span>
                <span className="text-gray-400">Episodes:</span>
                <span className="text-white font-semibold">{anime.total_episode || anime.episodes}</span>
              </div>
            )}
            {anime?.duration && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-400">⏱️</span>
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-semibold">{anime.duration}</span>
              </div>
            )}
            {anime?.released && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-pink-400">📅</span>
                <span className="text-gray-400">Released:</span>
                <span className="text-white font-semibold">{anime.released}</span>
              </div>
            )}
            {anime?.studio && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyan-400">🏢</span>
                <span className="text-gray-400">Studio:</span>
                <span className="text-white font-semibold">{anime.studio}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {Array.isArray(anime?.genre_list || anime?.genres) && (anime?.genre_list || anime?.genres).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(anime.genre_list || anime.genres).map((genre: any, i: number) => (
                <Link
                  key={genre?.slug || i}
                  href={`/genre/${genre?.slug || ''}`}
                  className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full hover:bg-primary/40 transition-colors"
                >
                  {genre?.name || genre?.title || String(genre)}
                </Link>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {anime?.synopsis && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Sinopsis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{anime.synopsis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Episode List */}
      {Array.isArray(anime?.episode_list || anime?.episodes) && (anime?.episode_list || anime?.episodes).length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            Daftar Episode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(anime.episode_list || anime.episodes).map((ep: any, index: number) => (
              <Link
                key={ep?.slug || index}
                href={ep?.slug ? `/episode/${ep.slug}` : '#'}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-transparent hover:border-primary/40 hover:bg-primary/10 transition-all group"
              >
                <span className="w-10 h-10 flex items-center justify-center bg-primary/20 text-primary rounded-lg text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                    {ep?.title || `Episode ${index + 1}`}
                  </p>
                  {ep?.date && (
                    <p className="text-xs text-gray-500">{ep.date}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
