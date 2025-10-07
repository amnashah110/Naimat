# Use official Node.js image (lightweight Alpine version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for efficient Docker caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy the full source code
COPY . .

# Build the NestJS project (compiles TypeScript → JavaScript in /dist)
RUN npm run build

# Expose the NestJS default port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
