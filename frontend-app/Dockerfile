# Use Node.js 18 as the base image for building
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.3.0

# Copy all source code (ensure we get everything)
COPY . ./

# List files to debug (remove this line once working)
RUN ls -la

# Install all dependencies (including dev dependencies for build)
RUN npm install --no-audit --no-fund --verbose

# Build the Angular app for production
RUN npm run build -- --configuration=production

# Use nginx to serve the built app
FROM nginx:alpine

# Copy the built app from the build stage
COPY --from=build /app/dist/retail-analytics-ui /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (standard for web services)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]