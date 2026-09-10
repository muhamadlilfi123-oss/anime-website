'use client';

import { useEffect, useState } from 'react';
import { getGenres, extractList } from '@/lib/api';
import Link from 'next/link';

export default function GenrePage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGenres()
      .then((res) => {
        const list = extractList(res?.data || res?.genreList || res?.genres || res);
        setGenres(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
        Genre Anime
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {genres.map((genre: any, index: number) => (
            <Link
              key={index}
              href={`/genre/${genre.slug}`}
              className="flex items-center justify-center p-4 bg-card rounded-xl border border-transparent hover:border-primary/40 hover:bg-primary/20 transition-all text-center group"
            >
              <span className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">
                {genre.name || genre.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
