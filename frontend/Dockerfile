FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Use development server with polling
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0
ENV NODE_ENV=development

# Start development server
CMD ["npm", "start"] 