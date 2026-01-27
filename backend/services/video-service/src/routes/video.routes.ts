import { Router, Request, Response } from 'express';
import { VideoService } from '../video.service.js';
import { requireAuth, requireAdmin } from '../../../api-gateway/src/auth.js';

export const videoRoutes = Router();

// Get public videos
videoRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = {
            audience: req.query.audience as string,
            language: req.query.language as string
        };
        const videos = await VideoService.getVideos(filters);
        res.json(videos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

videoRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const video = await VideoService.getVideoById(req.params.id);
        res.json(video);
    } catch (error: any) {
        res.status(404).json({ error: 'Video not found' });
    }
});

// Track progress (Auth required)
videoRoutes.post('/:id/progress', requireAuth, async (req: Request & { user?: any }, res: Response) => {
    try {
        const { progressSeconds, totalDuration } = req.body;
        const result = await VideoService.updateProgress(
            req.user.id,
            req.params.id,
            progressSeconds,
            totalDuration
        );
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Upload video
videoRoutes.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const video = await VideoService.createVideo(req.body);
        res.status(201).json(video);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
