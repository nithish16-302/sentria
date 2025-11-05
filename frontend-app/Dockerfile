# Use Node.js 18 for building
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package.json ./

# Install dependencies (npm install will work without package-lock.json)
RUN npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build -- --configuration=production --output-path=dist/retail-analytics-ui

# Verify build was successful
RUN if [ ! -f "dist/retail-analytics-ui/index.html" ]; then \
        echo "❌ BUILD FAILED - No index.html found in dist/retail-analytics-ui/"; \
        ls -la dist/ || echo "No dist directory"; \
        exit 1; \
    else \
        echo "✅ Build successful - Angular app ready"; \
        echo "Files created:"; \
        ls -la dist/retail-analytics-ui/; \
    fi

# Install serve globally
RUN npm install -g serve

# Create startup script for dynamic port handling
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'PORT=${PORT:-3000}' >> /start.sh && \
    echo 'echo "🚀 Starting Angular app on port $PORT"' >> /start.sh && \
    echo 'echo "Serving from: dist/retail-analytics-ui/"' >> /start.sh && \
    echo 'serve -s dist/retail-analytics-ui -l $PORT' >> /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE $PORT

# Start the app
CMD ["/start.sh"]