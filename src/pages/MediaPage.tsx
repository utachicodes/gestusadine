import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { MediaContent } from '@/types/ecosystem';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_VIDEOS } from '@/lib/mock-data';

export default function MediaPage() {
    const { t } = useLanguage();
    const [videos, setVideos] = useState<MediaContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadVideos();
    }, [activeTab]);

    const loadVideos = async () => {
        setLoading(true);
        const audience = activeTab === 'all' ? undefined : activeTab;
        const filteredVideos = activeTab === 'all' 
            ? MOCK_VIDEOS 
            : MOCK_VIDEOS.filter(v => v.audience === activeTab);
        
        // Use mock data immediately and stop loading
        setVideos(filteredVideos);
        setLoading(false);
        
        // Try to fetch from API in background (fire and forget)
        (async () => {
            try {
                const data = await EcosystemService.getVideos(audience);
                if (data.length > 0) {
                    setVideos(data);
                }
            } catch (error) {
                // Silently fail, already using mock data
            }
        })();
    };

    const handleWatch = (video: MediaContent) => {
        toast.info(`Starting video: ${video.title}`);
        // In a real app, this would open a video player modal or navigate to /watch/:id
        // For MVP, we'll simulate progress
        EcosystemService.updateVideoProgress(video.id, 60, video.duration_seconds || 120);
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-slate-400 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            {t('media.title')}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark dark:text-slate-100">
                            {t('media.subtitle')}
                        </h1>
                        <p className="mt-2 text-islamic-dark/70 dark:text-slate-300 max-w-xl">
                            {t('media.intro')}
                        </p>
                    </div>
                </header>

            <div className="w-full mb-8">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeTab === 'all'
                                ? 'bg-islamic-green-600 text-white shadow-md hover:bg-islamic-green-700'
                                : 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-300 border border-islamic-dark/20 dark:border-slate-700 hover:border-islamic-green-600 dark:hover:border-islamic-green hover:text-islamic-green-600 dark:hover:text-islamic-green'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab('kids')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeTab === 'kids'
                                ? 'bg-islamic-green-600 text-white shadow-md hover:bg-islamic-green-700'
                                : 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-300 border border-islamic-dark/20 dark:border-slate-700 hover:border-islamic-green-600 dark:hover:border-islamic-green hover:text-islamic-green-600 dark:hover:text-islamic-green'
                        }`}
                    >
                        Kids
                    </button>
                    <button
                        onClick={() => setActiveTab('teens')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeTab === 'teens'
                                ? 'bg-islamic-green-600 text-white shadow-md hover:bg-islamic-green-700'
                                : 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-300 border border-islamic-dark/20 dark:border-slate-700 hover:border-islamic-green-600 dark:hover:border-islamic-green hover:text-islamic-green-600 dark:hover:text-islamic-green'
                        }`}
                    >
                        Teens
                    </button>
                    <button
                        onClick={() => setActiveTab('adults')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeTab === 'adults'
                                ? 'bg-islamic-green-600 text-white shadow-md hover:bg-islamic-green-700'
                                : 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-300 border border-islamic-dark/20 dark:border-slate-700 hover:border-islamic-green-600 dark:hover:border-islamic-green hover:text-islamic-green-600 dark:hover:text-islamic-green'
                        }`}
                    >
                        Adults
                    </button>
                </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('media.loading')}</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('media.empty')}</p>
                        </div>
                    ) : videos.map((video) => (
                        <div key={video.id} className="islamic-card overflow-hidden hover:scale-[1.02] transition-transform">
                            <div className="aspect-video relative bg-islamic-dark/10 group cursor-pointer overflow-hidden rounded-t-lg" onClick={() => handleWatch(video)}>
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-islamic-dark/40">
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
                                    <h3 className="text-lg font-semibold text-islamic-dark line-clamp-2">{video.title}</h3>
                                    <Badge className="bg-islamic-gold/10 text-islamic-gold border-islamic-gold/20">{video.language}</Badge>
                                </div>
                                <p className="text-sm text-islamic-dark/70 line-clamp-2">{video.description}</p>
                                <Button className="w-full gap-2 btn-islamic" onClick={() => handleWatch(video)}>
                                    <PlayCircle size={16} /> {t('media.watch')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
