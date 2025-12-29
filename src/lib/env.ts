/**
 * Environment variable validation and access
 * Ensures all required environment variables are present at runtime
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_ADMIN_EMAIL?: string;
  VITE_OPENROUTER_API_KEY?: string;
  VITE_API_URL?: string;
}

const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;

function validateEnv(): EnvConfig {
  const missing: string[] = [];
  
  for (const key of requiredEnvVars) {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL,
    VITE_OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY,
    VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  };
}

export const env = validateEnv();

