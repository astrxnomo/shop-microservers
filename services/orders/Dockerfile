FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN DATABASE_URL=postgresql://dummy npx prisma generate
RUN npm run build

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY package*.json ./

EXPOSE 3003
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/index.js"]
