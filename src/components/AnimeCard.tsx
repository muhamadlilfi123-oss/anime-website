import Link from 'next/link';
import { extractSlug } from '@/lib/api';

interface AnimeCardProps {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  score?: string;
  status?: string;
  type?: string;
}

export default function AnimeCard({ title, slug, poster, episode, score, status, type }: AnimeCardProps) {
  const isOngoing = typeof status === 'string' && status.toLowerCase().includes('ongoing');
  const validSlug = extractSlug(slug) || extractSlug({ title }) || '';

  return (
    <Link href={validSlug ? `/anime/${validSlug}` : '#'} className="group block cursor-pointer">
      <div className="relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
          <img
            src={poster || 'https://placehold.co/300x400/1a1730/ffffff?text=No+Image'}
            alt={title || 'Anime'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1a1730/ffffff?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {type && (
              <span className="px-2 py-0.5 bg-primary/90 text-white text-xs font-semibold rounded-md">
                {type}
              </span>
            )}
            {score && (
              <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-xs font-bold rounded-md flex items-center gap-1">
                ⭐ {score}
              </span>
            )}
          </div>
          
          {episode && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 bg-accent/90 text-white text-xs font-semibold rounded-md">
                {episode}
              </span>
            </div>
          )}

          {status && (
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                isOngoing
                  ? 'bg-green-500/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}>
                {String(status)}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-primary transition-colors">
            {title || 'Untitled'}
          </h3>
        </div>
      </div>
    </Link>
  );
}
