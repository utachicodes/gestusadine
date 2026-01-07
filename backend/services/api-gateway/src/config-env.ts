import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Improved project root detection
function findProjectRoot(startDir: string): string {
    let currentDir = startDir;
    while (currentDir !== resolve(currentDir, "..")) {
        if (existsSync(resolve(currentDir, "package.json"))) {
            return currentDir;
        }
        currentDir = resolve(currentDir, "..");
    }
    return startDir; // Fallback
}

const projectRoot = findProjectRoot(__dirname);

console.log("🌍 Environment Initialization");
console.log("  Project root:", projectRoot);

// Load .env.local first (higher priority), then .env
const envLocalPath = resolve(projectRoot, ".env.local");
const envPath = resolve(projectRoot, ".env");

if (existsSync(envLocalPath)) {
    const result = dotenv.config({ path: envLocalPath, override: true });
    if (result.error) {
        console.warn("⚠️  Error loading .env.local:", result.error.message);
    } else {
        console.log("✅ Loaded .env.local");
    }
}

if (existsSync(envPath)) {
    const result = dotenv.config({ path: envPath, override: false });
    if (result.error) {
        console.warn("⚠️  Error loading .env:", result.error.message);
    } else {
        console.log("✅ Loaded .env");
    }
}

/**
 * Validates and cleans a Supabase URL or Key
 */
export function getCleanEnv(key: string, fallbackKey?: string): string | null {
    const value = process.env[key] || (fallbackKey ? process.env[fallbackKey] : null);

    if (!value) return null;

    const trimmed = value.trim();

    // Check for common placeholders
    if (
        trimmed === "" ||
        trimmed.startsWith("your_") ||
        trimmed.includes("INSERT_YOUR_") ||
        trimmed.includes("your-supabase-url")
    ) {
        return null;
    }

    return trimmed;
}

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(url: string | null): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
