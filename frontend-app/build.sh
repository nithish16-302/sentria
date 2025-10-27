#!/bin/bash
# Frontend Build Script for Render

echo "🎨 Building Angular Frontend for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
if [ -f "package-lock.json" ]; then
    echo "Found package-lock.json, using npm ci..."
    npm ci
else
    echo "No package-lock.json found, using npm install..."
    npm install --no-audit --no-fund
fi

# Build for production
echo "🔨 Building Angular app for production..."
npm run build -- --configuration=production

# Verify build output
if [ -d "dist/retail-analytics-ui" ]; then
    echo "✅ Build successful! Output directory exists."
    ls -la dist/retail-analytics-ui/
else
    echo "❌ Build failed! Output directory not found."
    exit 1
fi

echo "🎉 Frontend build complete!"