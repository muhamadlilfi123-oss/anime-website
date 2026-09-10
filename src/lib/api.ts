const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://www.sankavollerei.web.id/anime';

export async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const errJson = await res.json();
        throw new Error(errJson.message || `API Error: ${res.status}`);
      }
      const errText = await res.text();
      throw new Error(`API Error ${res.status}: ${errText.slice(0, 100)}`);
    }

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Format respons tidak valid (bukan JSON)`);
      }
    }

    return await res.json();
  } catch (error: any) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}

export async function getHome() {
  return fetchAPI('/home');
}

export async function getOngoing(page: number = 1) {
  return fetchAPI(`/ongoing-anime?page=${page}`);
}

export async function getComplete(page: number = 1) {
  return fetchAPI(`/complete-anime?page=${page}`);
}

export async function getAnimeDetail(slug: string) {
  try {
    return await fetchAPI(`/anime/${slug}`);
  } catch (err: any) {
    try {
      return await fetchAPI(`/${slug}`);
    } catch {
      return await fetchAPI(`/detail/${slug}`);
    }
  }
}

export async function getEpisode(slug: string) {
  try {
    return await fetchAPI(`/episode/${slug}`);
  } catch (err: any) {
    try {
      return await fetchAPI(`/${slug}`);
    } catch {
      return await fetchAPI(`/watch/${slug}`);
    }
  }
}

export async function getSchedule() {
  return fetchAPI('/schedule');
}

export async function getGenres() {
  return fetchAPI('/genre');
}

export async function getGenreAnime(slug: string, page: number = 1) {
  return fetchAPI(`/genre/${slug}?page=${page}`);
}

export function extractList(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.anime)) return data.anime;
    if (Array.isArray(data.animeList)) return data.animeList;
    if (Array.isArray(data.anime_list)) return data.anime_list;
    if (Array.isArray(data.ongoing)) return data.ongoing;
    if (Array.isArray(data.complete)) return data.complete;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.list)) return data.list;
  }
  return [];
}

export function extractSlug(item: any): string {
  if (!item) return '';
  if (typeof item === 'string') {
    const cleaned = item.replace(/\/+$/, '');
    const parts = cleaned.split('/');
    return parts[parts.length - 1] || '';
  }

  // Cek semua kemungkinan properti di API anime
  const raw = item.slug || 
              item.animeId || 
              item.anime_id || 
              item.episodeId || 
              item.episode_id || 
              item.endpoint || 
              item.id || 
              item.url || 
              item.link || 
              item.href || 
              '';

  if (raw) {
    const cleanStr = String(raw).replace(/\/+$/, '');
    const segments = cleanStr.split('/');
    return segments[segments.length - 1] || cleanStr;
  }

  // Fallback terakhir: jika hanya ada title/name, ubah jadi slug
  const title = item.title || item.name;
  if (title && typeof title === 'string') {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return '';
}
