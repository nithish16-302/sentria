# Use Node.js 18 as the base image for building
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.3.0

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
# Check if package-lock.json exists and use appropriate install command
RUN if [ -f "package-lock.json" ]; then \
        echo "Using npm ci with existing package-lock.json" && npm ci; \
    else \
        echo "No package-lock.json found, using npm install" && npm install --no-audit --no-fund; \
    fi

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration=production

# Use nginx to serve the built app
FROM nginx:alpine

# Install gettext for envsubst (environment variable substitution)
RUN apk add --no-cache gettext

# Copy the built app from the build stage
COPY --from=build /app/dist/retail-analytics-ui /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple startup script for environment variable handling
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port (Render will provide the PORT environment variable)
EXPOSE $PORT

# Start nginx with the startup script
CMD ["/docker-entrypoint.sh"]