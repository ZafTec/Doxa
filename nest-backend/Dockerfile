# Bun is the runtime everywhere - dev, tests, and here. Never swap this
# stage's CMD for `nest start`/node; see web/AGENTS.md "Stack".
ARG BUN_VERSION=1.3.14

# ---- deps: installed once, cached across builds; also runs `prisma
# generate` via postinstall so the generated client exists for later stages ----
FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

# ---- build: compile TypeScript with Nest's build, keeping the already
# generated Prisma client from deps intact ----
FROM oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN bun run build

# ---- runtime: minimal image, Bun runs the compiled output directly ----
FROM oven/bun:${BUN_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./

EXPOSE 3000
CMD ["bun", "dist/src/main.js"]
