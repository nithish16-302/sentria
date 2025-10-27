#!/bin/bash
# Frontend Build Script for Render

echo "🎨 Building Angular Frontend for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --no-audit --no-fund

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