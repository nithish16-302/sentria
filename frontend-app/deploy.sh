#!/bin/bash
# Frontend Build Script

echo "🎨 Building Retail Analytics Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building Angular project..."
npm run build

# Serve the project locally
echo "🏃 Starting development server..."
npm start

echo "✅ Frontend build completed!"
echo "📋 Development server will start on http://localhost:4200"