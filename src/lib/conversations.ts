export interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  confidence?: number;
  sources?: string[];
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

/** Sort messages in ascending order by createdAt (oldest first). */
export function sortMessagesAsc(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => a.createdAt - b.createdAt);
}

/** Truncate a conversation title to a maximum length, adding "…" when trimmed. */
export function truncateTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength - 1) + "…";
}

/** Check whether a user owns a conversation. */
export function isConversationOwner(
  conversation: Conversation | null | undefined,
  userId: string
): boolean {
  if (!conversation) return false;
  return conversation.userId === userId;
}
