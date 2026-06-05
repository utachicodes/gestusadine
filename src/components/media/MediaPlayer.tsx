import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mic, Film } from 'lucide-react';
import { useTr } from '@/lib/i18n';

/**
 * Reusable media player modal. Supports:
 *  - YouTube watch / youtu.be / embed URLs (real 11-char IDs)
 *  - Direct video files (.mp4/.webm/.ogg)
 *  - Direct audio files (podcasts)
 * Placeholder/unpublished entries fall back to a clean "coming soon" panel 
 * we intentionally do NOT guess external content URLs. Drop real URLs into the
 * data seam (or Convex) and playback lights up automatically.
 */

function youtubeEmbed(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})(?:[?&]|$)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

const isDirectMedia = (url: string | undefined, exts: RegExp) =>
  !!url && !url.includes('placeholder') && exts.test(url);

interface MediaPlayerProps {
  open: boolean;
  onClose: () => void;
  kind: 'video' | 'audio';
  title?: string;
  src?: string;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ open, onClose, kind, title, src }) => {
  const tr = useTr();
  const yt = kind === 'video' ? youtubeEmbed(src) : null;
  const directVideo = kind === 'video' && isDirectMedia(src, /\.(mp4|webm|ogg)(\?|$)/i);
  const directAudio = kind === 'audio' && isDirectMedia(src, /\.(mp3|m4a|aac|wav|ogg)(\?|$)/i);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="pr-8">{title}</DialogTitle>
          <DialogDescription className="sr-only">{tr({ en: 'Media player', fr: 'Lecteur multimédia' })}</DialogDescription>
        </DialogHeader>

        {yt ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={yt}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : directVideo ? (
          <video src={src} controls autoPlay className="w-full rounded-lg bg-black" />
        ) : directAudio ? (
          <div className="rounded-lg bg-muted p-6">
            <audio src={src} controls autoPlay className="w-full" />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center text-center gap-3 p-6">
            {kind === 'audio' ? (
              <Mic className="w-10 h-10 text-muted-foreground/40" />
            ) : (
              <Film className="w-10 h-10 text-muted-foreground/40" />
            )}
            <p className="text-sm text-muted-foreground max-w-sm">
              {kind === 'audio'
                ? tr({ en: 'This audio will stream here once it’s published.', fr: 'Cet audio sera disponible ici dès sa publication.' })
                : tr({ en: 'This video will stream here once it’s published.', fr: 'Cette vidéo sera disponible ici dès sa publication.' })}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
