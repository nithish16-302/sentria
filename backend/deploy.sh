#!/bin/bash
# Backend Deployment Script

echo "🚀 Building Retail Analytics Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run the application locally
echo "🏃 Starting backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo "✅ Backend server started on http://localhost:8000"