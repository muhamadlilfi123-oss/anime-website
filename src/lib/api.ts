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
  return fetchAPI(`/anime/${slug}`);
}

export async function getEpisode(slug: string) {
  return fetchAPI(`/episode/${slug}`);
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
