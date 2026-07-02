import { describe, it, expect } from "vitest";
import {
  sortMessagesAsc,
  truncateTitle,
  isConversationOwner,
  type Message,
  type Conversation,
} from "../lib/conversations";

describe("sortMessagesAsc", () => {
  it("returns messages sorted by createdAt ascending", () => {
    const messages: Message[] = [
      { _id: "3", conversationId: "c1", role: "user", content: "third", createdAt: 300 },
      { _id: "1", conversationId: "c1", role: "user", content: "first", createdAt: 100 },
      { _id: "2", conversationId: "c1", role: "assistant", content: "second", createdAt: 200 },
    ];
    const sorted = sortMessagesAsc(messages);
    expect(sorted.map((m) => m.createdAt)).toEqual([100, 200, 300]);
  });

  it("does not mutate the original array", () => {
    const messages: Message[] = [
      { _id: "2", conversationId: "c1", role: "user", content: "b", createdAt: 200 },
      { _id: "1", conversationId: "c1", role: "user", content: "a", createdAt: 100 },
    ];
    sortMessagesAsc(messages);
    expect(messages[0].createdAt).toBe(200);
  });

  it("returns empty array for empty input", () => {
    expect(sortMessagesAsc([])).toEqual([]);
  });

  it("returns single-element array unchanged", () => {
    const msg: Message[] = [
      { _id: "1", conversationId: "c1", role: "assistant", content: "hi", createdAt: 500 },
    ];
    expect(sortMessagesAsc(msg)).toEqual(msg);
  });

  it("preserves all message fields", () => {
    const msg: Message = {
      _id: "1",
      conversationId: "c1",
      role: "assistant",
      content: "hello",
      createdAt: 100,
      confidence: 0.9,
      sources: ["src1"],
    };
    const sorted = sortMessagesAsc([msg]);
    expect(sorted[0].confidence).toBe(0.9);
    expect(sorted[0].sources).toEqual(["src1"]);
  });
});

describe("truncateTitle", () => {
  it("returns short titles unchanged", () => {
    expect(truncateTitle("Hello")).toBe("Hello");
  });

  it("truncates long titles with ellipsis", () => {
    const long = "A".repeat(70);
    const result = truncateTitle(long, 60);
    expect(result).toHaveLength(60);
    expect(result.endsWith("…")).toBe(true);
  });

  it("uses default max length of 60", () => {
    const title = "A".repeat(61);
    expect(truncateTitle(title)).toHaveLength(60);
    expect(truncateTitle(title).endsWith("…")).toBe(true);
  });

  it("respects custom maxLength", () => {
    expect(truncateTitle("Hello World", 5)).toBe("Hell…");
  });

  it("returns exact title when length equals maxLength", () => {
    const title = "A".repeat(60);
    expect(truncateTitle(title)).toBe(title);
  });
});

describe("isConversationOwner", () => {
  const conv: Conversation = {
    _id: "c1",
    userId: "u1",
    title: "Test",
    createdAt: 100,
    updatedAt: 100,
  };

  it("returns true for matching userId", () => {
    expect(isConversationOwner(conv, "u1")).toBe(true);
  });

  it("returns false for non-matching userId", () => {
    expect(isConversationOwner(conv, "u2")).toBe(false);
  });

  it("returns false for null conversation", () => {
    expect(isConversationOwner(null, "u1")).toBe(false);
  });

  it("returns false for undefined conversation", () => {
    expect(isConversationOwner(undefined, "u1")).toBe(false);
  });
});
