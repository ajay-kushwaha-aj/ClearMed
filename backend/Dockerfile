# Backend Dockerfile for Express Server
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies uniquely for backend
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose API port
EXPOSE 5000

# Run the express server
CMD [ "node", "server.js" ]
