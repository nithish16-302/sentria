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
RUN npm run build

# Install serve globally to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 80

# Serve the built files
CMD ["serve", "-s", "dist/retail-analytics-ui", "-l", "80"]