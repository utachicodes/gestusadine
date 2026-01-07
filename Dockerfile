# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Frontend (Vite -> dist/)
# This runs "vite build" as defined in package.json
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files for runtime deps
COPY package*.json ./

# Install production dependencies only (optional, but sticking to full install for simplicity with tsx)
RUN npm install

# Copy source code
COPY . .

# Copy built frontend assets from builder
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 4000

# Environment variables should be passed at runtime
ENV NODE_ENV=production
ENV PORT=4000

# Start Backend Gateway
# Uses tsx to run TypeScript directly (simplest for this setup)
CMD ["npx", "tsx", "backend/services/api-gateway/src/server.ts"]
