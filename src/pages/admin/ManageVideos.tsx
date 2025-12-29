import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, Plus, Edit, Trash2, Sparkles, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaContent } from '@/types/ecosystem';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function ManageVideos() {
    const { t } = useLanguage();
    const [videos, setVideos] = useState<MediaContent[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [aiScript, setAiScript] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        thumbnail_url: '',
        duration_seconds: '',
        language: 'fr',
        audience: 'adults' as 'kids' | 'teens' | 'adults',
        transcript: '',
    });

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('media_content')
                .select('*')
                .eq('type', 'video')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVideos(data || []);
        } catch (error: any) {
            console.error('Failed to load videos:', error);
            toast.error('Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async (file: File) => {
        setUploadingVideo(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `videos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            setFormData({ ...formData, url: data.publicUrl });
            toast.success('Video uploaded successfully');
        } catch (error: any) {
            console.error('Failed to upload video:', error);
            toast.error('Failed to upload video');
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleThumbnailUpload = async (file: File) => {
        setUploadingThumbnail(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            setFormData({ ...formData, thumbnail_url: data.publicUrl });
            toast.success('Thumbnail uploaded successfully');
        } catch (error: any) {
            console.error('Failed to upload thumbnail:', error);
            toast.error('Failed to upload thumbnail');
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!aiScript.trim()) {
            toast.error('Please provide a script for video generation');
            return;
        }

        setIsGenerating(true);
        try {
            // Call OpenRouter API directly from client-side
            const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!openRouterApiKey) {
                throw new Error('OpenRouter API key not configured');
            }

            // Generate video script and metadata using AI
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openRouterApiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'XamSaDine AI'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an Islamic content video generator. Generate a video title, description, and transcript based on the provided script. Return JSON with: title, description, transcript, estimated_duration_seconds.'
                        },
                        {
                            role: 'user',
                            content: `Generate video content for this script:\n\n${aiScript}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate video content');
            }

            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content);

            // Create video entry in database
            const videoData = {
                title: content.title || `AI Generated Video - ${new Date().toLocaleDateString()}`,
                description: content.description || 'AI generated video based on Islamic content',
                type: 'video',
                url: '', // Will be updated when video is actually generated
                thumbnail_url: '',
                duration_seconds: content.estimated_duration_seconds || 300,
                language: formData.language,
                audience: formData.audience,
                transcript: content.transcript || aiScript,
            };

            const { data: newVideo, error: insertError } = await supabase
                .from('media_content')
                .insert([videoData])
                .select()
                .single();

            if (insertError) throw insertError;

            setIsAIModalOpen(false);
            setAiScript('');
            await loadVideos();
            toast.success('AI video content generated successfully! Note: Video file generation requires additional processing.');
        } catch (error: any) {
            console.error('Failed to generate AI video:', error);
            toast.error(error.message || 'Failed to generate AI video');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const videoData = {
                title: formData.title,
                description: formData.description,
                type: 'video' as const,
                url: formData.url,
                thumbnail_url: formData.thumbnail_url || null,
                duration_seconds: formData.duration_seconds ? parseInt(formData.duration_seconds) : null,
                language: formData.language,
                audience: formData.audience,
                transcript: formData.transcript || null,
            };

            if (editingId) {
                const { error } = await supabase
                    .from('media_content')
                    .update(videoData)
                    .eq('id', editingId);

                if (error) throw error;
                toast.success('Video updated successfully');
                setEditingId(null);
            } else {
                const { data, error } = await supabase
                    .from('media_content')
                    .insert([videoData])
                    .select()
                    .single();

                if (error) throw error;
                toast.success('Video created successfully');
                setIsCreating(false);
            }

            await loadVideos();
            setFormData({
                title: '',
                description: '',
                url: '',
                thumbnail_url: '',
                duration_seconds: '',
                language: 'fr',
                audience: 'adults',
                transcript: '',
            });
        } catch (error: any) {
            console.error('Failed to save video:', error);
            toast.error(error.message || 'Failed to save video');
        }
    };

    const handleEdit = (video: MediaContent) => {
        setEditingId(video.id);
        setFormData({
            title: video.title,
            description: video.description,
            url: video.url,
            thumbnail_url: video.thumbnail_url || '',
            duration_seconds: video.duration_seconds?.toString() || '',
            language: video.language,
            audience: video.audience,
            transcript: video.transcript || '',
        });
        setIsCreating(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            // Get video details first to access file URLs
            const { data: video } = await supabase
                .from('media_content')
                .select('*')
                .eq('id', id)
                .single();

            if (video) {
                // Delete video file from storage if it exists
                if (video.url && video.url.includes('videos/')) {
                    const videoPath = video.url.split('/videos/')[1];
                    if (videoPath) {
                        await supabase.storage.from('videos').remove([`videos/${videoPath}`]);
                    }
                }

                // Delete thumbnail from storage if it exists
                if (video.thumbnail_url && video.thumbnail_url.includes('thumbnails/')) {
                    const thumbnailPath = video.thumbnail_url.split('/thumbnails/')[1];
                    if (thumbnailPath) {
                        await supabase.storage.from('videos').remove([`thumbnails/${thumbnailPath}`]);
                    }
                }
            }

            // Delete database entry
            const { error } = await supabase
                .from('media_content')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Video and associated files deleted successfully');
            await loadVideos();
        } catch (error: any) {
            console.error('Failed to delete video:', error);
            toast.error('Failed to delete video');
        }
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex justify-between items-center">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            Admin
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
                            Manage <span className="text-gradient">Videos</span>
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsAIModalOpen(true)}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate AI Video
                        </Button>
                        <Button
                            onClick={() => {
                                setIsCreating(true);
                                setEditingId(null);
                                setFormData({
                                    title: '',
                                    description: '',
                                    url: '',
                                    thumbnail_url: '',
                                    duration_seconds: '',
                                    language: 'fr',
                                    audience: 'adults',
                                    transcript: '',
                                });
                            }}
                            className="btn-islamic"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Video
                        </Button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green"></div>
                    </div>
                ) : (
                    <>
                        {isCreating && (
                            <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
                                <CardHeader>
                                    <CardTitle>{editingId ? 'Edit Video' : 'Upload New Video'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            placeholder="Video Title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            rows={4}
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Video URL</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Video URL"
                                                    value={formData.url}
                                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                    className="flex-1"
                                                    required
                                                />
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleVideoUpload(file);
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={uploadingVideo}
                                                        className="whitespace-nowrap"
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {uploadingVideo ? 'Uploading...' : 'Upload'}
                                                    </Button>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Thumbnail</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Thumbnail URL"
                                                    value={formData.thumbnail_url}
                                                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                                    className="flex-1"
                                                />
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleThumbnailUpload(file);
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={uploadingThumbnail}
                                                        className="whitespace-nowrap"
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {uploadingThumbnail ? 'Uploading...' : 'Upload'}
                                                    </Button>
                                                </label>
                                            </div>
                                            {formData.thumbnail_url && (
                                                <img src={formData.thumbnail_url} alt="Thumbnail preview" className="mt-2 h-32 w-56 object-cover rounded" />
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Duration (seconds)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.duration_seconds}
                                                    onChange={(e) => setFormData({ ...formData, duration_seconds: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Language</label>
                                                <select
                                                    value={formData.language}
                                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="fr">French</option>
                                                    <option value="en">English</option>
                                                    <option value="wo">Wolof</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Audience</label>
                                                <select
                                                    value={formData.audience}
                                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="kids">Kids</option>
                                                    <option value="teens">Teens</option>
                                                    <option value="adults">Adults</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Transcript (optional)</label>
                                            <Textarea
                                                placeholder="Video transcript for RAG indexing"
                                                value={formData.transcript}
                                                onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" className="btn-islamic">
                                                {editingId ? 'Update' : 'Create'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsCreating(false);
                                                    setEditingId(null);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <Card key={video.id} className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30 overflow-hidden">
                                    <div className="aspect-video relative bg-islamic-dark/10">
                                        {video.thumbnail_url ? (
                                            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <PlayCircle size={48} className="text-islamic-dark/40" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-islamic-dark line-clamp-2">{video.title}</h3>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(video)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(video.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-islamic-dark/70 line-clamp-2 mb-3">{video.description}</p>
                                        <div className="flex gap-2">
                                            <Badge>{video.language}</Badge>
                                            <Badge variant="outline">{video.audience}</Badge>
                                            <Badge variant="outline">{Math.floor((video.duration_seconds || 0) / 60)} min</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {/* AI Video Generation Modal */}
                <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Generate AI Video</DialogTitle>
                            <DialogDescription>
                                Provide a script or description, and AI will generate video content including title, description, and transcript.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Script/Description</label>
                                <Textarea
                                    value={aiScript}
                                    onChange={(e) => setAiScript(e.target.value)}
                                    placeholder="Enter your video script or description here..."
                                    rows={8}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Language</label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="fr">French</option>
                                        <option value="en">English</option>
                                        <option value="wo">Wolof</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Audience</label>
                                    <select
                                        value={formData.audience}
                                        onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="kids">Kids</option>
                                        <option value="teens">Teens</option>
                                        <option value="adults">Adults</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAIModalOpen(false);
                                    setAiScript('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiScript.trim()}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isGenerating ? 'Generating...' : 'Generate'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>
        </div>
    );
}

