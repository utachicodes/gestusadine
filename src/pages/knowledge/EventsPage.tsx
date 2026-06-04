import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents, useEventRegistrations } from '@/data/events';
import { useTr } from '@/lib/i18n';
import { PageHeader } from '@/components/layout/PageHeader';

export default function EventsPage() {
    const { language } = useLanguage();
    const tr = useTr();
    const events = useEvents();
    const { registeredIds, register } = useEventRegistrations();
    const [registering, setRegistering] = useState<Record<string, boolean>>({});

    const fmtDay = (iso: string) =>
        language === 'fr' ? format(new Date(iso), 'd MMM yyyy', { locale: fr }) : format(new Date(iso), 'MMM d, yyyy');
    const fmtTime = (iso: string) =>
        language === 'fr' ? format(new Date(iso), 'HH:mm') : format(new Date(iso), 'h:mm a');

    const handleRegister = (eventId: string) => {
        if (registering[eventId] || registeredIds.has(eventId)) return;
        setRegistering((prev) => ({ ...prev, [eventId]: true }));
        // Optimistic local registration; swap for useMutation(api.events.register) later.
        register(eventId);
        toast.success(tr({ en: 'Successfully registered for the event!', fr: 'Inscription réussie !' }));
        setRegistering((prev) => ({ ...prev, [eventId]: false }));
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <PageHeader
                    eyebrow={tr({ en: 'Events', fr: 'Événements' })}
                    title={tr({ en: 'Upcoming gatherings', fr: 'Rencontres à venir' })}
                    subtitle={tr({
                        en: 'Lectures, circles, and community programs across Senegal and online.',
                        fr: 'Conférences, cercles et programmes communautaires au Sénégal et en ligne.',
                    })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{tr({ en: 'No upcoming events right now. Check back soon.', fr: 'Aucun événement à venir pour le moment. Revenez bientôt.' })}</p>
                        </div>
                    ) : events.map((event) => (
                        <div key={event.id} className="islamic-card flex flex-col">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-xl font-semibold text-islamic-dark">{event.title}</h3>
                                    <div className="flex flex-col items-end text-sm text-islamic-gold font-medium whitespace-nowrap">
                                        <span>{fmtDay(event.start_time)}</span>
                                        <span>{fmtTime(event.start_time)}</span>
                                    </div>
                                </div>
                                <p className="text-islamic-dark/70">{event.description}</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-islamic-dark/70">
                                        <MapPin size={16} className="text-islamic-green-600" />
                                        <span>{event.location_name || tr({ en: 'Online', fr: 'En ligne' })}</span>
                                    </div>
                                    {event.max_attendees && (
                                        <div className="flex items-center gap-2 text-islamic-dark/70">
                                            <Users size={16} className="text-islamic-blue" />
                                            <span>{tr({ en: 'Max capacity', fr: 'Capacité max' })}: {event.max_attendees}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 pt-0">
                                <Button
                                    className="w-full btn-islamic"
                                    onClick={() => handleRegister(event.id)}
                                    disabled={registering[event.id] || registeredIds.has(event.id)}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {registering[event.id]
                                        ? tr({ en: 'Processing…', fr: 'Traitement…' })
                                        : registeredIds.has(event.id)
                                            ? tr({ en: 'Registered', fr: 'Inscrit' })
                                            : tr({ en: 'Register', fr: 'S’inscrire' })}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
