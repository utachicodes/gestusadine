interface EnvConfig {
  VITE_CONVEX_URL: string;
  VITE_ADMIN_EMAIL?: string;
  VITE_API_URL?: string;
}

const requiredEnvVars = ['VITE_CONVEX_URL'] as const;

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
    VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
    VITE_ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
}

export const env = validateEnv();
