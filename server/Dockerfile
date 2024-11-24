# Use a base Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "start"]