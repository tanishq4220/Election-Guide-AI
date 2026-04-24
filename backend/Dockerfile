# Use official Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Use environment variable for port
ENV PORT=8080

# Start the application
CMD ["node", "server.js"]
