# ── Stage 1 : build ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN yarn install --immutable

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

# ── Stage 2 : production ────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN yarn install --immutable --only=production

# Copier le client Prisma généré et le schéma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Applique les migrations puis démarre
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
