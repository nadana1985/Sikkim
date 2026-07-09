FROM node:20-alpine AS base

# Install build dependencies for native modules (better-sqlite3, sharp)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# ─── Build ────────────────────────────────────────────────────────────────────
FROM base AS build

RUN npm ci && npm cache clean --force
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Install runtime dependencies for sharp
RUN apk add --no-cache vips-dev

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files
COPY --from=build /app/dist ./dist

# Copy static assets directory
RUN mkdir -p data/images

# Create non-root user
RUN addgroup -g 1001 -S monastery && \
    adduser -S monastery -u 1001 -G monastery

# Ensure data directory is writable
RUN chown -R monastery:monastery /app/data

USER monastery

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
