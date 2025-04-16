# ============ Stage 1: Build Stage ============
FROM node:slim AS builder

# Set working directory
WORKDIR /app

# Copy only the necessary files for faster Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# ============ Stage 2: Production Image ============
FROM node:slim

# Set working directory
WORKDIR /app

# Copy package files and only prod dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled JS code from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (make sure this matches your backend)
EXPOSE 3000

# Run the app
CMD ["node", "dist/index.js"]
