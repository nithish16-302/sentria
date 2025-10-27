# Use Node.js 18 for building
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies with minimal flags
RUN npm install

# Build the app
RUN npm run build

# Install serve globally to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 80

# Serve the built files
CMD ["serve", "-s", "dist/retail-analytics-ui", "-l", "80"]