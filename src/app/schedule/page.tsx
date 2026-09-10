'use client';

import { useEffect, useState } from 'react';
import { getSchedule } from '@/lib/api';
import Link from 'next/link';
import { AnimeGridSkeleton } from '@/components/LoadingSkeleton';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_MAP: Record<string, string> = {
  monday: 'Senin', tuesday: 'Selasa', wednesday: 'Rabu',
  thursday: 'Kamis', friday: 'Jumat', saturday: 'Sabtu', sunday: 'Minggu',
  senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu',
  kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu', minggu: 'Minggu',
};

export default function SchedulePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string>('');

  useEffect(() => {
    getSchedule()
      .then((res) => {
        setData(res);
        const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
        setActiveDay(today || DAYS[0]);
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

  // Normalize schedule data
  const scheduleData = data?.data || data?.schedule || data || [];
  const scheduleByDay: Record<string, any[]> = {};
  
  if (Array.isArray(scheduleData)) {
    scheduleData.forEach((item: any) => {
      if (!item || typeof item !== 'object') return;
      const dayRaw = typeof item.day === 'string' ? item.day.toLowerCase() : '';
      const day = DAY_MAP[dayRaw] || item.day || 'Lainnya';
      if (!scheduleByDay[day]) scheduleByDay[day] = [];
      if (Array.isArray(item.anime_list)) {
        scheduleByDay[day].push(...item.anime_list);
      } else if (Array.isArray(item.anime)) {
        scheduleByDay[day].push(...item.anime);
      } else {
        scheduleByDay[day].push(item);
      }
    });
  } else if (scheduleData && typeof scheduleData === 'object') {
    Object.entries(scheduleData).forEach(([key, animes]: [string, any]) => {
      const day = DAY_MAP[key.toLowerCase()] || key;
      scheduleByDay[day] = Array.isArray(animes) ? animes : [];
    });
  }

  const displayDays = Object.keys(scheduleByDay).length > 0 ? Object.keys(scheduleByDay) : DAYS;
  const currentDayAnimes = scheduleByDay[activeDay] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1 h-8 bg-accent rounded-full"></span>
        Jadwal Rilis Anime
      </h1>

      {/* Day tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {displayDays.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeDay === day
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-card text-gray-400 hover:bg-primary/20 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Anime List */}
      {loading ? (
        <AnimeGridSkeleton />
      ) : currentDayAnimes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentDayAnimes.map((anime: any, index: number) => (
            <Link
              key={index}
              href={`/anime/${anime.slug}`}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-transparent hover:border-primary/40 hover:bg-primary/10 transition-all group"
            >
              <img
                src={anime.poster || anime.thumb}
                alt={anime.title}
                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-primary transition-colors">
                  {anime.title}
                </h3>
                {anime.time && (
                  <p className="text-xs text-gray-500 mt-1">🕐 {anime.time}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Tidak ada anime untuk hari {activeDay}</p>
        </div>
      )}
    </div>
  );
}
