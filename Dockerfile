# Step 1: Use Node.js official image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json tsconfig*.json ./
RUN npm install

# Step 4: Copy the rest of your project
COPY . .

# Step 5: Build the frontend (Vite)
RUN npm run build

# Step 6: Expose the PORT
ENV PORT=5000
EXPOSE 5000

# Step 7: Start your server
CMD ["npx", "tsx", "server.ts"]
