#!/bin/bash
# Render Deployment Script

echo "🚀 Deploying to Render..."

# Set Python version (Render should use the version from runtime.txt)
echo "🐍 Using Python $(python --version)"

# Upgrade pip and install build tools
echo "🔧 Setting up build environment..."
pip install --upgrade pip
pip install wheel setuptools

# Install system dependencies if needed (uncomment if required)
# apt-get update && apt-get install -y build-essential

# Install Python dependencies with optimizations for Render
echo "📦 Installing Python dependencies..."
pip install --no-cache-dir --prefer-binary -r requirements.txt

# Verify critical packages are installed
echo "✅ Verifying installation..."
python -c "import pandas, fastapi, uvicorn; print('Core packages imported successfully')"

echo "🎯 Deployment preparation complete!"