# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY FriFood/package.json FriFood/package-lock.json ./
RUN npm ci

# Build Angular app
COPY FriFood/ ./

# Which environment to bake into the SPA bundle.
# - "local": local docker-compose (localhost ports) via Angular "docker" configuration
# - "dev": AKS dev ingress hostnames baked into environment.ts
# - "production": AKS prod ingress hostnames baked into environment.ts
ARG BUILD_ENV=local

RUN if [ "$BUILD_ENV" = "production" ]; then \
		cp src/environments/environment.prod.example.ts src/environments/environment.ts \
		&& npx ng build --configuration production --prerender=false; \
	elif [ "$BUILD_ENV" = "dev" ]; then \
		cp src/environments/environment.dev.example.ts src/environments/environment.ts \
		&& npx ng build --configuration production --prerender=false; \
	else \
		cp src/environments/environment.docker.example.ts src/environments/environment.ts \
		&& cp src/environments/environment.docker.example.ts src/environments/environment.docker.ts \
		&& npx ng build --configuration docker --prerender=false; \
	fi

# Runtime stage
FROM nginx:1.27-alpine

# SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy browser build output (Angular SSR build produces dist/<app>/browser)
COPY --from=build /app/dist/FriFood/browser/ /usr/share/nginx/html/

# Runtime env injection for nginx image (runs before nginx starts)
COPY docker/20-runtime-env.sh /docker-entrypoint.d/20-runtime-env.sh
# Ensure script is executable and has Unix LF line endings (Windows CRLF can break /bin/sh)
RUN chmod +x /docker-entrypoint.d/20-runtime-env.sh \
	&& sed -i 's/\r$//' /docker-entrypoint.d/20-runtime-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
