import { db } from '../../api-gateway/src/lib/firebase-admin.js';
import { MediaContent, MediaProgress } from '../../../shared/ecosystem-types.js';

export const VideoService = {
    // Get all videos with optional filtering
    async getVideos(filters?: { audience?: string; language?: string }) {
        let query = db.collection('media_content')
            .where('type', '==', 'video')
            .orderBy('published_at', 'desc');

        if (filters?.audience) {
            query = query.where('audience', '==', filters.audience);
        }
        if (filters?.language) {
            query = query.where('language', '==', filters.language);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as MediaContent[];
    },

    // Get single video
    async getVideoById(id: string) {
        const doc = await db.collection('media_content').doc(id).get();
        if (!doc.exists) {
            throw new Error('Video not found');
        }
        return {
            id: doc.id,
            ...doc.data()
        } as MediaContent;
    },

    // Update progress
    async updateProgress(userId: string, mediaId: string, seconds: number, totalDuration: number) {
        const isCompleted = seconds >= (totalDuration * 0.9); // 90% watched = completed

        const progressRef = db.collection('media_progress').doc(`${userId}_${mediaId}`);
        const progressData = {
            user_id: userId,
            media_id: mediaId,
            progress_seconds: seconds,
            completed: isCompleted,
            last_watched_at: new Date().toISOString()
        };

        await progressRef.set(progressData, { merge: true });

        // If completed, log activity
        if (isCompleted) {
            await db.collection('user_activity').add({
                user_id: userId,
                activity_type: 'video_watch',
                target_id: mediaId,
                metadata: { completed_at: new Date().toISOString() },
                created_at: new Date().toISOString()
            });
        }

        return {
            id: progressRef.id,
            ...progressData
        } as MediaProgress;
    },

    // Admin: Create Video
    async createVideo(video: Omit<MediaContent, 'id' | 'created_at' | 'published_at'>) {
        const videoData = {
            ...video,
            type: 'video',
            created_at: new Date().toISOString(),
            published_at: new Date().toISOString()
        };

        const docRef = await db.collection('media_content').add(videoData);
        const doc = await docRef.get();

        const data = {
            id: doc.id,
            ...doc.data()
        } as MediaContent;

        // Index into RAG for Search
        if (data.transcript || data.description) {
            try {
                const { ragService } = await import('../../rag-service/rag.service.js');
                await ragService.ingestDocument(
                    `video_${data.id}`,
                    data.title,
                    `[Video: ${data.title}]\nCategory: ${data.audience}\nLanguage: ${data.language}\nDescription: ${data.description}\n\nTranscript:\n${data.transcript || 'No transcript available.'}`,
                    `video:${data.id}`,
                    'multimedia'
                );
            } catch (err) {
                console.error('Failed to index video:', err);
            }
        }

        return data;
    }
};
