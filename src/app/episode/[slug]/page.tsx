'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEpisode, extractSlug } from '@/lib/api';
import Link from 'next/link';
import { EpisodeSkeleton } from '@/components/LoadingSkeleton';

const renderText = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (Array.isArray(val)) return val.map(renderText).join(' ');
  if (typeof val === 'object') {
    return val.name || val.title || val.server || val.quality || val.resolution || '';
  }
  return String(val);
};

export default function EpisodePage({ params }: { params?: { slug?: string } }) {
  const routerParams = useParams();
  const rawSlug = params?.slug || routerParams?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || '';

  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState(0);
  const [activeQuality, setActiveQuality] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !slug) return;
    setLoading(true);
    setError(null);
    getEpisode(slug)
      .then(setData)
      .catch((err) => setError(err.message || 'Gagal memuat video episode'))
      .finally(() => setLoading(false));
  }, [isMounted, slug]);

  if (!isMounted || loading) return <EpisodeSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-card rounded-2xl max-w-md mx-4">
          <p className="text-red-400 text-lg mb-2">⚠️ Gagal memuat episode</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-accent transition-colors">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  const episode = data?.data || data?.episode || data || {};
  const streamingServers = Array.isArray(episode?.streaming) 
    ? episode.streaming 
    : Array.isArray(episode?.server)
    ? episode.server
    : Array.isArray(episode?.servers)
    ? episode.servers
    : Array.isArray(episode?.server_list)
    ? episode.server_list
    : [];

  const currentServer = streamingServers[activeServer];
  const qualities = Array.isArray(currentServer?.quality) 
    ? currentServer.quality 
    : Array.isArray(currentServer?.qualities)
    ? currentServer.qualities
    : [];

  // Cari URL streaming dari berbagai kemungkinan format
  let rawUrl = qualities[activeQuality]?.url || 
               qualities[activeQuality]?.link || 
               currentServer?.url || 
               currentServer?.link || 
               currentServer?.iframe ||
               episode?.stream_url || 
               episode?.link_stream || 
               episode?.streamLink || 
               episode?.video_url || 
               episode?.url || 
               episode?.iframe || 
               '';

  // Jika iframe berupa HTML string `<iframe src="...">`, ambil src-nya
  if (typeof rawUrl === 'string' && rawUrl.includes('<iframe')) {
    const match = rawUrl.match(/src=["'](.*?)["']/);
    if (match && match[1]) {
      rawUrl = match[1];
    }
  }

  const prevSlug = extractSlug(episode?.prev_episode || episode?.prev || episode?.previous_episode);
  const nextSlug = extractSlug(episode?.next_episode || episode?.next);
  const animeSlug = extractSlug(episode?.anime_slug || episode?.animeId || episode?.anime);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-primary/10 mb-6">
        {rawUrl ? (
          <iframe
            src={rawUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
            <p className="text-lg mb-2">🎬 Video Player</p>
            <p className="text-sm">Pilih server atau kualitas di bawah untuk memutar video</p>
          </div>
        )}
      </div>

      {/* Episode Title */}
      <h1 className="text-2xl font-bold mb-4 text-white">
        {renderText(episode?.title || episode?.name || 'Episode')}
      </h1>

      {/* Server Selection */}
      {streamingServers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Pilih Server:</h3>
          <div className="flex flex-wrap gap-2">
            {streamingServers.map((server: any, index: number) => (
              <button
                key={index}
                onClick={() => { setActiveServer(index); setActiveQuality(0); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeServer === index
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-card text-gray-400 hover:bg-primary/20 hover:text-white'
                }`}
              >
                {renderText(server?.name || server?.server || `Server ${index + 1}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quality Selection */}
      {qualities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Kualitas:</h3>
          <div className="flex flex-wrap gap-2">
            {qualities.map((q: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveQuality(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeQuality === index
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'bg-card text-gray-400 hover:bg-accent/20 hover:text-white'
                }`}
              >
                {renderText(q?.quality || q?.name || q?.resolution || `Quality ${index + 1}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {prevSlug ? (
          <Link
            href={`/episode/${prevSlug}`}
            className="px-6 py-3 bg-card border border-primary/30 rounded-xl text-sm font-medium text-gray-300 hover:bg-primary/20 hover:text-white transition-all"
          >
            ← Episode Sebelumnya
          </Link>
        ) : <div />}
        {animeSlug && (
          <Link
            href={`/anime/${animeSlug}`}
            className="px-6 py-3 bg-primary/20 border border-primary/30 rounded-xl text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all"
          >
            📋 Semua Episode
          </Link>
        )}
        {nextSlug ? (
          <Link
            href={`/episode/${nextSlug}`}
            className="px-6 py-3 bg-card border border-primary/30 rounded-xl text-sm font-medium text-gray-300 hover:bg-primary/20 hover:text-white transition-all"
          >
            Episode Selanjutnya →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
