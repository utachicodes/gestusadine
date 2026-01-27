import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { Event } from '@/types/ecosystem';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_EVENTS } from '@/lib/mock-data';

export default function EventsPage() {
    const { t } = useLanguage();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState<Record<string, boolean>>({});
    const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadEvents();
        loadRegistrations();
    }, []);

    const loadEvents = async () => {
        setLoading(true);

        // Use mock data immediately and stop loading
        setEvents(MOCK_EVENTS);
        setLoading(false);

        // Try to fetch from API in background (fire and forget)
        (async () => {
            try {
                const data = await EcosystemService.getEvents();
                if (data.length > 0) {
                    setEvents(data);
                }
            } catch (error) {
                // Silently fail, already using mock data
            }
        })();
    };

    const loadRegistrations = async () => {
        try {
            const registrations = await EcosystemService.getMyRegistrations();
            const eventIds = new Set(registrations.map((r: any) => r.event_id || r.id)) as Set<string>;
            setRegisteredEvents(eventIds);
        } catch (error) {
            // Silently fail
        }
    };

    const handleRegister = async (eventId: string) => {
        if (registering[eventId] || registeredEvents.has(eventId)) return;

        setRegistering(prev => ({ ...prev, [eventId]: true }));

        try {
            await EcosystemService.registerForEvent(eventId);
            setRegisteredEvents(prev => new Set([...prev, eventId]));
            toast.success(t('events.registered') || "Successfully registered for event!");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t('error.registration_failed');
            toast.error(message);
        } finally {
            setRegistering(prev => ({ ...prev, [eventId]: false }));
        }
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-slate-400 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            {t('events.title')}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark dark:text-slate-100">
                            {t('events.subtitle')}
                        </h1>
                        <p className="mt-2 text-islamic-dark/70 dark:text-slate-300 max-w-xl">
                            {t('events.intro')}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('events.loading')}</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('events.empty')}</p>
                        </div>
                    ) : events.map((event) => (
                        <div key={event.id} className="islamic-card flex flex-col">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-xl font-semibold text-islamic-dark">{event.title}</h3>
                                    <div className="flex flex-col items-end text-sm text-islamic-gold font-medium whitespace-nowrap">
                                        <span>{format(new Date(event.start_time), 'MMM d, yyyy')}</span>
                                        <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                                    </div>
                                </div>
                                <p className="text-islamic-dark/70">{event.description}</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-islamic-dark/70">
                                        <MapPin size={16} className="text-islamic-green-600" />
                                        <span>{event.location_name || 'Online'}</span>
                                    </div>
                                    {event.max_attendees && (
                                        <div className="flex items-center gap-2 text-islamic-dark/70">
                                            <Users size={16} className="text-islamic-blue" />
                                            <span>Max Capacity: {event.max_attendees}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 pt-0">
                                <Button
                                    className="w-full btn-islamic"
                                    onClick={() => handleRegister(event.id)}
                                    disabled={registering[event.id] || registeredEvents.has(event.id)}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {registering[event.id]
                                        ? (t('login.processing') || 'Processing...')
                                        : registeredEvents.has(event.id)
                                            ? t('events.registered')
                                            : t('events.register')
                                    }
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
