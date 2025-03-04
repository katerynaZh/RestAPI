# Use official Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./vite.config.js .
COPY ./settings.json .
COPY ./index.html .
COPY ./src ./src

# Expose Vite's default dev port
EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "dev", "--", "--host"]