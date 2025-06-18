# Use official Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json & package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Start the app
CMD ["node", "app.js"]