import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Event } from '@/types/ecosystem';

export function useEvents(): Event[] {
  const events = useQuery(api.events.list) ?? [];
  return events.map((e) => ({
    id: e._id,
    title: e.title,
    description: e.description,
    start_time: new Date(e.date).toISOString(),
    end_time: new Date(e.date + 5400000).toISOString(),
    location_name: e.location,
    is_online: e.location.toLowerCase().includes('online') || e.location.toLowerCase().includes('zoom') || e.location.toLowerCase().includes('discord'),
    max_attendees: e.capacity,
    image_url: e.image,
    created_at: new Date(e.createdAt).toISOString(),
  }));
}

export function useEventRegistrations() {
  const registerMut = useMutation(api.events.register);
  const myRegs = useQuery(api.events.myRegistrations) ?? [];
  const registeredIds = new Set<string>(myRegs.map((id) => id as string));
  const register = (eventId: string) => {
    registerMut({ eventId: eventId as any });
  };
  return { registeredIds, register };
}
