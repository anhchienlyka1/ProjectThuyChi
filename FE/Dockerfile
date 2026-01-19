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
# Adjust the path if your project name is different in angular.json
COPY --from=builder /app/dist/ProjectThuyChi ./dist/ProjectThuyChi
COPY --from=builder /app/package*.json ./

# Install production dependencies (if needed for the server script)
# Often SSR bundles dependencies, but sometimes not all. content of package.json is needed.
RUN npm ci --only=production

# Expose the SSR port (Angular universal often defaults to 4000)
EXPOSE 4000

# Start the SSR server
CMD ["npm", "run", "serve:ssr:ProjectThuyChi"]
