# syntax=docker/dockerfile:1
# Production image for Certra (Nuxt 4 / Nitro node-server preset).
# Multi-stage: build the Nitro output, then ship a slim runtime that also
# carries the SQL migrations (see SDLC/01-architecture/deployment.md).

# ---- Build stage ----------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# better-sqlite3 is a native addon; compiling it on alpine (musl) needs a toolchain.
RUN apk add --no-cache python3 make g++

# Copy the full source before installing: the `postinstall: nuxt prepare` hook
# needs nuxt.config + app/ present, and better-sqlite3's native build runs during
# install (so `--ignore-scripts` is not an option).
COPY . .
RUN npm ci

# Build the Nitro server bundle.
RUN npm run build

# ---- Production stage -----------------------------------------------------
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATABASE_PATH=/app/.data/certra.db

# better-sqlite3's compiled binary links libstdc++ at runtime.
RUN apk add --no-cache libstdc++

# The Nitro output...
COPY --from=build /app/.output ./.output
# ...and the SQL migrations. createDb() resolves them from the working directory
# at runtime; `npm run build` does NOT bundle them, so copy them in explicitly at
# the same relative path (see SDLC/01-architecture/deployment.md).
COPY --from=build /app/server/database/migrations ./server/database/migrations

# SQLite data lives on a mounted volume so it survives redeploys. Owned by the
# non-root `node` user the container runs as.
RUN mkdir -p /app/.data && chown -R node:node /app/.data
VOLUME ["/app/.data"]

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
