# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app (src, tsconfig, etc.)
COPY . .

# Build TypeScript into dist/
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
