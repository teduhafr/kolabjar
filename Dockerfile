FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install pm2 -g


# production stage
WORKDIR /app
CMD ["pm2-runtime", "--no-auto-exit", "server.js"]