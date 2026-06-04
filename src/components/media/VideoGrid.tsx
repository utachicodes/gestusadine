import React, { useState } from 'react';
import { MediaContent } from '@/types/ecosystem';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useVideos } from '@/data/videos';
import { MediaPlayer } from '@/components/media/MediaPlayer';
import { useTr, type Loc } from '@/lib/i18n';

const AUDIENCE_TABS: { value: string; label: Loc }[] = [
  { value: 'all', label: { en: 'All', fr: 'Tous' } },
  { value: 'kids', label: { en: 'Kids', fr: 'Enfants' } },
  { value: 'teens', label: { en: 'Teens', fr: 'Ados' } },
  { value: 'adults', label: { en: 'Adults', fr: 'Adultes' } },
];

/**
 * Educational video catalogue with audience filters and a modal player.
 * Lives inside the Library "Videos" tab. Reads the `useVideos` data seam.
 */
export function VideoGrid() {
  const tr = useTr();
  const [audience, setAudience] = useState('all');
  const [active, setActive] = useState<MediaContent | null>(null);
  const videos = useVideos(audience);

  const handleWatch = (video: MediaContent) => setActive(video);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {AUDIENCE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setAudience(tab.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              audience === tab.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-foreground border border-border hover:border-primary hover:text-primary'
            }`}
          >
            {tr(tab.label)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {tr({ en: 'No videos here yet. Check back soon.', fr: 'Aucune vidéo ici pour l’instant. Revenez bientôt.' })}
            </p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="islamic-card overflow-hidden hover:scale-[1.02] transition-transform">
              <div
                className="aspect-video relative bg-muted group cursor-pointer overflow-hidden rounded-t-lg"
                onClick={() => handleWatch(video)}
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/40">
                    <PlayCircle size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                  <Clock size={12} />
                  {Math.floor((video.duration_seconds || 0) / 60)} min
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{video.title}</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{video.language}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                <Button className="w-full gap-2 btn-islamic" onClick={() => handleWatch(video)}>
                  <PlayCircle size={16} /> {tr({ en: 'Watch', fr: 'Regarder' })}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <MediaPlayer
        open={!!active}
        onClose={() => setActive(null)}
        kind="video"
        title={active?.title}
        src={active?.url}
      />
    </div>
  );
}

export default VideoGrid;
