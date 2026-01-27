import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Event } from '@/types/ecosystem';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase-helpers';

export default function ManageEvents() {
    const { t } = useLanguage();
    const [events, setEvents] = useState<Event[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location_name: '',
        is_online: false,
        max_attendees: '',
        image_url: '',
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await getDocuments('events', [
                orderBy('created_at', 'desc')
            ]);
            setEvents(data as Event[]);
        } catch (error: any) {
            console.error('Failed to load events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                start_time: formData.start_time,
                end_time: formData.end_time || null,
                location_name: formData.location_name,
                is_online: formData.is_online,
                max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                image_url: formData.image_url || null,
            };

            if (editingId) {
                await updateDocument('events', editingId, eventData);
                toast.success('Event updated successfully');
                setEditingId(null);
            } else {
                await addDocument('events', eventData);
                toast.success('Event created successfully');
                setIsCreating(false);
            }

            await loadEvents();
            setFormData({
                title: '',
                description: '',
                start_time: '',
                end_time: '',
                location_name: '',
                is_online: false,
                max_attendees: '',
                image_url: '',
            });
        } catch (error: any) {
            console.error('Failed to save event:', error);
            toast.error(error.message || 'Failed to save event');
        }
    };

    const handleEdit = (event: Event) => {
        setEditingId(event.id);
        setFormData({
            title: event.title,
            description: event.description || '',
            start_time: new Date(event.start_time).toISOString().slice(0, 16),
            end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
            location_name: event.location_name || '',
            is_online: event.is_online || false,
            max_attendees: event.max_attendees?.toString() || '',
            image_url: event.image_url || '',
        });
        setIsCreating(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await deleteDocument('events', id);
            toast.success('Event deleted successfully');
            await loadEvents();
        } catch (error: any) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event');
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
                            Manage <span className="text-gradient">Events</span>
                        </h1>
                    </div>
                    <Button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            setFormData({
                                title: '',
                                description: '',
                                start_time: '',
                                end_time: '',
                                location_name: '',
                                is_online: false,
                                max_attendees: '',
                                image_url: '',
                            });
                        }}
                        className="btn-islamic"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
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
                                    <CardTitle>{editingId ? 'Edit Event' : 'Create New Event'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            placeholder="Event Title"
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
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Start Time</label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.start_time}
                                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">End Time</label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.end_time}
                                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Input
                                            placeholder="Location"
                                            value={formData.location_name}
                                            onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                                            required
                                        />
                                        <Input
                                            placeholder="Image URL (optional)"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="is_online"
                                                checked={formData.is_online}
                                                onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
                                            />
                                            <label htmlFor="is_online">Online Event</label>
                                        </div>
                                        <Input
                                            placeholder="Max Attendees"
                                            type="number"
                                            value={formData.max_attendees}
                                            onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                                        />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <Card key={event.id} className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-islamic-dark">{event.title}</h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-islamic-dark/70 mb-4">{event.description}</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-islamic-dark/70">
                                                <Calendar size={16} />
                                                <span>{format(new Date(event.start_time), 'MMM d, yyyy h:mm a')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-islamic-dark/70">
                                                <MapPin size={16} />
                                                <span>{event.location_name}</span>
                                            </div>
                                            {event.max_attendees && (
                                                <div className="flex items-center gap-2 text-islamic-dark/70">
                                                    <Users size={16} />
                                                    <span>Max: {event.max_attendees}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
