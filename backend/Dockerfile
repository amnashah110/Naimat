# 1️⃣ Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# 2️⃣ Set the working directory
WORKDIR /usr/src/app

# 3️⃣ Copy package.json and lock file
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm ci

# 5️⃣ Copy source code
COPY . .

# 6️⃣ Build the NestJS app
RUN npm run build

# 7️⃣ Create a smaller image for production
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy only necessary files from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose NestJS port
EXPOSE 80

# Set environment variable for NestJS
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]
