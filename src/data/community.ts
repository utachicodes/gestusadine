import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export type CircleIcon = 'book' | 'star' | 'heart' | 'globe' | 'users';
export type CircleAccent = 'green' | 'gold' | 'sage';

export interface Circle {
  id: string;
  name: string;
  topic: string;
  description: string;
  memberCount: number;
  iconKey: CircleIcon;
  accent: CircleAccent;
  lastActive: string;
}

export interface CirclePost {
  id: string;
  circleId: string;
  author: string;
  body: string;
  createdAt: string;
  likes: number;
}

const ICONS: CircleIcon[] = ['book', 'star', 'heart', 'globe', 'users'];
const ACCENTS: CircleAccent[] = ['green', 'gold', 'sage'];

function pickIcon(name: string): CircleIcon {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return ICONS[hash % ICONS.length];
}

function pickAccent(name: string): CircleAccent {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 17 + name.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function useCircles(): Circle[] {
  const circles = useQuery(api.community.list) ?? [];
  return circles.map((c) => ({
    id: c._id,
    name: c.name,
    topic: c.description.slice(0, 60),
    description: c.description,
    memberCount: (c as any).memberCount ?? 0,
    iconKey: pickIcon(c.name),
    accent: pickAccent(c.name),
    lastActive: timeAgo(c.updatedAt),
  }));
}

export function useCircleById(id: string | undefined): Circle | undefined {
  const circles = useCircles();
  return circles.find((c) => c.id === id);
}

export function useCirclePosts(circleId: string | undefined): CirclePost[] {
  const posts = useQuery(api.community.postsWithAuthors, { circleId: circleId as any }) ?? [];
  return posts.map((p) => ({
    id: p._id,
    circleId: p.circleId,
    author: (p as any).authorName ?? 'Anonymous',
    body: p.content,
    createdAt: new Date(p.createdAt).toISOString(),
    likes: 0,
  }));
}

const JOINED_KEY = 'gestusadine_joined_circles';

export function useJoinedCircles() {
  const joinMut = useMutation(api.community.join);
  const leaveMut = useMutation(api.community.leave);
  const [joined, setJoined] = React.useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(JOINED_KEY) || '[]'));
    } catch {
      return new Set<string>();
    }
  });

  const toggleJoin = (circleId: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(circleId)) {
        next.delete(circleId);
        leaveMut({ circleId: circleId as any });
      } else {
        next.add(circleId);
        joinMut({ circleId: circleId as any });
      }
      localStorage.setItem(JOINED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return { joined, toggleJoin };
}
