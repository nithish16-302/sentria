#!/bin/bash
# Backend Deployment Script

echo "🚀 Building Retail Analytics Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
# Upgrade pip first
pip install --upgrade pip

# Install wheel and setuptools for better compatibility
pip install wheel setuptools

# Install dependencies with compatibility flags
pip install -r requirements.txt --no-cache-dir --prefer-binary

# Run the application locally
echo "🏃 Starting backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo "✅ Backend server started on http://localhost:8000"