// Convex functions run in a custom runtime that exposes process.env.
// TypeScript doesn't know about it without @types/node, so we declare
// only the minimal shape we actually use.
declare const process: { env: Record<string, string | undefined> };
