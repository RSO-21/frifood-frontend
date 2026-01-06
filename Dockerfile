# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY FriFood/package.json FriFood/package-lock.json ./
RUN npm ci

# Build Angular app
COPY FriFood/ ./
RUN npx ng build --configuration docker

# Runtime stage
FROM nginx:1.27-alpine

# SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy browser build output (Angular SSR build produces dist/<app>/browser)
COPY --from=build /app/dist/FriFood/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
