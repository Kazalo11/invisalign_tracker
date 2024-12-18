# Build Stage
FROM node:22.12-alpine3.20 AS builder
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
