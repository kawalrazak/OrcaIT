# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 crm

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server.js leads-db.js ./
COPY --from=build /app/dist ./dist

# Persist website leads received from OrcaITWeb
RUN mkdir -p /app/data && chown -R crm:nodejs /app/data

USER crm
EXPOSE 3001
CMD ["node", "server.js"]
