# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runner stage
FROM node:20-alpine

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
