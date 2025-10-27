#!/bin/bash
# Generate package-lock.json for consistent builds

echo "🔧 Generating package-lock.json for consistent builds..."

# Navigate to frontend-app directory
cd "$(dirname "$0")"

# Remove existing node_modules if present
if [ -d "node_modules" ]; then
    echo "🗑️ Removing existing node_modules..."
    rm -rf node_modules
fi

# Remove existing package-lock.json if present
if [ -f "package-lock.json" ]; then
    echo "🗑️ Removing existing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies to generate package-lock.json
echo "📦 Installing dependencies to generate package-lock.json..."
npm install --package-lock-only

# Verify package-lock.json was created
if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json generated successfully!"
    echo "📋 Summary:"
    echo "- Package lock version: $(jq -r '.lockfileVersion' package-lock.json 2>/dev/null || echo 'unknown')"
    echo "- Total packages: $(jq -r '.packages | length' package-lock.json 2>/dev/null || echo 'unknown')"
else
    echo "❌ Failed to generate package-lock.json"
    exit 1
fi

echo "🎉 Setup complete! You can now use npm ci for faster, reproducible builds."