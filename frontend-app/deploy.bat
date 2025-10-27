@echo off
REM Frontend Build Script (Windows)

echo 🎨 Building Retail Analytics Frontend...

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building Angular project...
npm run build

REM Serve the project locally
echo 🏃 Starting development server...
npm start

echo ✅ Frontend build completed!
echo 📋 Development server will start on http://localhost:4200