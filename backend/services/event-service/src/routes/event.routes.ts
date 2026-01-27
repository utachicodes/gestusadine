import { Router, Request, Response } from 'express';
import { EventService } from '../event.service.js';
import { requireAuth, requireAdmin } from '../../../api-gateway/src/auth.js';

export const eventRoutes = Router();

// Get upcoming events
eventRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const events = await EventService.getUpcomingEvents();
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

eventRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await EventService.getEventById(req.params.id);
        res.json(event);
    } catch (error: any) {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Register for event (Auth required)
eventRoutes.post('/:id/register', requireAuth, async (req: Request & { user?: any }, res: Response) => {
    try {
        const result = await EventService.registerUser(
            req.user.id,
            req.params.id
        );
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get my registrations
eventRoutes.get('/my/registrations', requireAuth, async (req: Request & { user?: any }, res: Response) => {
    try {
        const registrations = await EventService.getUserRegistrations(req.user.id);
        res.json(registrations);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Create Event
eventRoutes.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const event = await EventService.createEvent(req.body);
        res.status(201).json(event);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
