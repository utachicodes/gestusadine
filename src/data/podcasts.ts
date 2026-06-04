import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PodcastEpisode } from '@/types/ecosystem';

export function useEpisodes(category = 'All'): PodcastEpisode[] {
  const episodes = useQuery(api.podcasts.list, { category: category !== 'All' ? category : undefined }) ?? [];
  return episodes.map((e) => ({
    id: e._id,
    title: e.title,
    guest: e.guestName ?? 'Scholar',
    duration: formatDuration(e.duration),
    category: e.category,
    description: e.description,
    audio_url: e.audioUrl,
    published_at: new Date(e.createdAt).toISOString().split('T')[0],
  }));
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}min` : `${m} min`;
}

export const PODCAST_CATEGORIES = ['All', 'Aqeedah', 'Fiqh', 'History', 'Spirituality', 'Quran', 'Family'];
