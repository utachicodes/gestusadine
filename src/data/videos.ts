import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MediaContent } from '@/types/ecosystem';

export function useVideos(audience?: string): MediaContent[] {
  const videos = useQuery(api.videos.list) ?? [];
  return videos
    .filter((v) => !audience || audience === 'all' || v.category === audience)
    .map((v) => ({
      id: v._id,
      title: v.title,
      description: v.description,
      type: 'video' as const,
      url: v.url,
      thumbnail_url: v.thumbnail,
      duration_seconds: v.duration,
      language: v.category === 'fr' ? 'fr' : 'en',
      audience: (v.category === 'kids' || v.category === 'teens' || v.category === 'adults' ? v.category : 'adults') as 'kids' | 'teens' | 'adults',
      published_at: new Date(v.createdAt).toISOString(),
      created_at: new Date(v.createdAt).toISOString(),
    }));
}
