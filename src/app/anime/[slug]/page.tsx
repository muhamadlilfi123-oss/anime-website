'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAnimeDetail, extractSlug } from '@/lib/api';
import Link from 'next/link';
import { DetailSkeleton } from '@/components/LoadingSkeleton';

const renderText = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (Array.isArray(val)) return val.map(renderText).join(' ');
  if (typeof val === 'object') {
    return val.name || val.title || val.value || '';
  }
  return String(val);
};

export default function AnimeDetailPage({ params }: { params?: { slug?: string } }) {
  const routerParams = useParams();
  const rawSlug = params?.slug || routerParams?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || '';

  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !slug) return;
    setLoading(true);
    setError(null);
    getAnimeDetail(slug)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat detail anime');
      })
      .finally(() => setLoading(false));
  }, [isMounted, slug]);

  if (!isMounted || loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-card rounded-2xl max-w-md mx-4">
          <p className="text-red-400 text-lg mb-2">⚠️ Gagal memuat data anime</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-accent transition-colors">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  const anime = data?.data || data?.anime || data || {};

  const episodeList: any[] = Array.isArray(anime?.episode_list)
    ? anime.episode_list
    : Array.isArray(anime?.episodes)
    ? anime.episodes
    : Array.isArray(anime?.episodeList)
    ? anime.episodeList
    : Array.isArray(anime?.list_episode)
    ? anime.list_episode
    : [];

  const genreList: any[] = Array.isArray(anime?.genre_list)
    ? anime.genre_list
    : Array.isArray(anime?.genres)
    ? anime.genres
    : Array.isArray(anime?.genreList)
    ? anime.genreList
    : [];

  const firstEp = episodeList.length > 0 
    ? (episodeList[0]?.slug ? episodeList[episodeList.length - 1] : episodeList[0]) 
    : null;
  const firstEpSlug = firstEp ? extractSlug(firstEp) : '';

  const posterImg = anime?.poster || anime?.thumb || anime?.image || 'https://placehold.co/300x400/1a1730/ffffff?text=No+Image';
  const animeTitle = renderText(anime?.title || anime?.name) || 'Detail Anime';
  const synopsisText = renderText(anime?.synopsis || anime?.sinopsis);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Anime Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-72 flex-shrink-0 flex flex-col items-center">
          <img
            src={posterImg}
            alt={animeTitle}
            className="w-full rounded-xl shadow-2xl shadow-primary/10 object-cover aspect-[3/4]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1a1730/ffffff?text=No+Image';
            }}
          />
          {firstEpSlug && (
            <Link
              href={`/episode/${firstEpSlug}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
            >
              <span>▶</span> Mulai Nonton
            </Link>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-white">
            {animeTitle}
          </h1>
          {anime?.japanese && (
            <p className="text-gray-400 text-sm mb-4 italic">{renderText(anime.japanese)}</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {anime?.score && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-400">Score:</span>
                <span className="text-white font-semibold">{renderText(anime.score)}</span>
              </div>
            )}
            {anime?.status && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400">●</span>
                <span className="text-gray-400">Status:</span>
                <span className="text-white font-semibold">{renderText(anime.status)}</span>
              </div>
            )}
            {anime?.type && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-400">📺</span>
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold">{renderText(anime.type)}</span>
              </div>
            )}
            {(anime?.total_episode || anime?.episodes) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-400">🎬</span>
                <span className="text-gray-400">Episodes:</span>
                <span className="text-white font-semibold">{renderText(anime.total_episode || anime.episodes)}</span>
              </div>
            )}
            {anime?.duration && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-400">⏱️</span>
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-semibold">{renderText(anime.duration)}</span>
              </div>
            )}
            {anime?.released && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-pink-400">📅</span>
                <span className="text-gray-400">Released:</span>
                <span className="text-white font-semibold">{renderText(anime.released)}</span>
              </div>
            )}
            {anime?.studio && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyan-400">🏢</span>
                <span className="text-gray-400">Studio:</span>
                <span className="text-white font-semibold">{renderText(anime.studio)}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {genreList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {genreList.map((genre: any, i: number) => {
                const genreSlug = extractSlug(genre) || genre?.name || '';
                return (
                  <Link
                    key={genreSlug || i}
                    href={genreSlug ? `/genre/${genreSlug}` : '#'}
                    className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full hover:bg-primary/40 transition-colors"
                  >
                    {renderText(genre)}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Synopsis */}
          {synopsisText && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Sinopsis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{synopsisText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Episode List */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-primary rounded-full"></span>
          Daftar Episode
        </h2>
        {episodeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {episodeList.map((ep: any, index: number) => {
              const epSlug = extractSlug(ep);
              return (
                <Link
                  key={epSlug || index}
                  href={epSlug ? `/episode/${epSlug}` : '#'}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-transparent hover:border-primary/40 hover:bg-primary/10 transition-all group"
                >
                  <span className="w-10 h-10 flex items-center justify-center bg-primary/20 text-primary rounded-lg text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                      {renderText(ep?.title || ep?.name || ep?.episode || `Episode ${index + 1}`)}
                    </p>
                    {ep?.date && (
                      <p className="text-xs text-gray-500">{renderText(ep.date)}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 py-6">Belum ada episode yang tersedia untuk anime ini.</p>
        )}
      </section>
    </div>
  );
}
