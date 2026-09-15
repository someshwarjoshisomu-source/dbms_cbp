# ==========================================================
# STAGE 1: Build React Production Bundle
# ==========================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================================
# STAGE 2: Lightweight Nginx Server
# ==========================================================
FROM nginx:alpine AS runner

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx configuration for single-page application (SPA) routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
