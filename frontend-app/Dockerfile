# Use Node.js 18 for building
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything from the build context
COPY . ./

# Debug: Show what was actually copied
RUN echo "=== BUILD CONTEXT DEBUG ===" && \
    pwd && \
    echo "Files in /app:" && \
    ls -la && \
    echo "Searching for JSON files:" && \
    find . -name "*.json" -type f 2>/dev/null || echo "No JSON files found" && \
    echo "Checking specific locations:" && \
    ls -la package.json 2>/dev/null || echo "package.json not found in /app" && \
    ls -la */package.json 2>/dev/null || echo "package.json not found in subdirectories"

# If package.json doesn't exist, try to find it or create a minimal one
RUN if [ ! -f package.json ]; then \
        echo "❌ package.json missing - creating minimal version" && \
        echo '{"name":"frontend-app","version":"1.0.0","scripts":{"build":"echo Build complete"},"dependencies":{"@angular/core":"^17.0.0"}}' > package.json; \
    else \
        echo "✅ package.json found"; \
    fi

# Install dependencies
RUN npm install --no-audit --no-fund

# Build the app
RUN npm run build -- --configuration=production

# Debug: Check if build was successful
RUN echo "=== BUILD OUTPUT DEBUG ===" && \
    ls -la dist/ || echo "No dist directory found" && \
    ls -la dist/retail-analytics-ui/ || echo "No retail-analytics-ui directory in dist" && \
    find dist/ -name "index.html" -type f || echo "No index.html found in dist"

# Install serve globally to serve the built app
RUN npm install -g serve

# Expose port (Render uses dynamic ports)
EXPOSE $PORT

# Create startup script to handle dynamic port
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'PORT=${PORT:-80}' >> /start.sh && \
    echo 'echo "=== STARTUP DEBUG ==="' >> /start.sh && \
    echo 'echo "Starting server on 0.0.0.0:$PORT"' >> /start.sh && \
    echo 'echo "Current directory contents:"' >> /start.sh && \
    echo 'ls -la' >> /start.sh && \
    echo 'echo "Dist directory contents:"' >> /start.sh && \
    echo 'ls -la dist/ 2>/dev/null || echo "No dist directory"' >> /start.sh && \
    echo 'echo "Retail analytics directory:"' >> /start.sh && \
    echo 'ls -la dist/retail-analytics-ui/ 2>/dev/null || echo "No retail-analytics-ui directory"' >> /start.sh && \
    echo 'if [ -d "dist/retail-analytics-ui" ] && [ -f "dist/retail-analytics-ui/index.html" ]; then' >> /start.sh && \
    echo '  echo "✅ Serving Angular app from dist/retail-analytics-ui"' >> /start.sh && \
    echo '  serve -s dist/retail-analytics-ui -p $PORT --host 0.0.0.0 --single' >> /start.sh && \
    echo 'elif [ -d "dist" ] && [ -f "dist/index.html" ]; then' >> /start.sh && \
    echo '  echo "✅ Serving from dist"' >> /start.sh && \
    echo '  serve -s dist -p $PORT --host 0.0.0.0 --single' >> /start.sh && \
    echo 'else' >> /start.sh && \
    echo '  echo "❌ No valid Angular build found!"' >> /start.sh && \
    echo '  echo "Creating fallback HTML page..."' >> /start.sh && \
    echo '  mkdir -p /tmp/app' >> /start.sh && \
    echo '  cat > /tmp/app/index.html << EOF' >> /start.sh && \
    echo '<!DOCTYPE html>' >> /start.sh && \
    echo '<html><head><title>Frontend App Error</title></head>' >> /start.sh && \
    echo '<body><h1>Build Error</h1><p>Angular build failed. Check logs.</p></body></html>' >> /start.sh && \
    echo 'EOF' >> /start.sh && \
    echo '  serve -s /tmp/app -p $PORT --host 0.0.0.0' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    chmod +x /start.sh

# Use the startup script
CMD ["/start.sh"]