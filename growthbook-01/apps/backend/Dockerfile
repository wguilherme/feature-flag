FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm ci

# Build the app
RUN npx nx build backend --prod

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files and built app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/apps/backend ./dist

# Install production dependencies only
RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
