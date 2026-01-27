import { db } from '../../api-gateway/src/lib/firebase-admin.js';
import { Event, EventRegistration } from '../../../shared/ecosystem-types.js';

export const EventService = {
    // Get upcoming events
    async getUpcomingEvents(limit = 10) {
        const now = new Date().toISOString();
        const snapshot = await db.collection('events')
            .where('start_time', '>=', now)
            .orderBy('start_time', 'asc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Event[];
    },

    // Get specific event
    async getEventById(id: string) {
        const doc = await db.collection('events').doc(id).get();
        if (!doc.exists) {
            throw new Error('Event not found');
        }
        return {
            id: doc.id,
            ...doc.data()
        } as Event;
    },

    // Register user for event
    async registerUser(userId: string, eventId: string) {
        // 1. Check if event is full
        const event = await this.getEventById(eventId);
        if (event.max_attendees) {
            const registrations = await db.collection('event_registrations')
                .where('event_id', '==', eventId)
                .where('status', '==', 'confirmed')
                .get();

            if (registrations.size >= event.max_attendees) {
                throw new Error('Event is fully booked');
            }
        }

        // 2. Check if already registered
        const existing = await db.collection('event_registrations')
            .where('user_id', '==', userId)
            .where('event_id', '==', eventId)
            .limit(1)
            .get();

        if (!existing.empty) {
            throw new Error('Already registered');
        }

        // 3. Register
        const registrationData = {
            user_id: userId,
            event_id: eventId,
            status: 'confirmed',
            created_at: new Date().toISOString()
        };

        const docRef = await db.collection('event_registrations').add(registrationData);

        // 4. Log Activity
        await db.collection('user_activity').add({
            user_id: userId,
            activity_type: 'event_register',
            target_id: eventId,
            metadata: { event_title: event.title },
            created_at: new Date().toISOString()
        });

        return {
            id: docRef.id,
            ...registrationData
        } as EventRegistration;
    },

    // Get user's registrations
    async getUserRegistrations(userId: string) {
        const snapshot = await db.collection('event_registrations')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc')
            .get();

        const registrations = [];
        for (const doc of snapshot.docs) {
            const registration = { id: doc.id, ...doc.data() };
            // Fetch event details
            const eventDoc = await db.collection('events').doc(registration.event_id).get();
            if (eventDoc.exists) {
                registrations.push({
                    ...registration,
                    event: { id: eventDoc.id, ...eventDoc.data() }
                });
            }
        }

        return registrations;
    },

    // Admin: Create Event
    async createEvent(event: Omit<Event, 'id' | 'created_at'>) {
        const eventData = {
            ...event,
            created_at: new Date().toISOString()
        };

        const docRef = await db.collection('events').add(eventData);
        const doc = await docRef.get();

        const data = {
            id: doc.id,
            ...doc.data()
        } as Event;

        // Index into RAG
        try {
            const { ragService } = await import('../../rag-service/rag.service.js');
            await ragService.ingestDocument(
                `event_${data.id}`,
                data.title,
                `[Event: ${data.title}]\nLocation: ${data.location_name}\nTime: ${data.start_time}\nDescription: ${data.description}\nMax Attendees: ${data.max_attendees}`,
                `event:${data.id}`,
                'community'
            );
        } catch (err) {
            console.error('Failed to index event:', err);
        }

        return data;
    }
};
