# Build Stage
FROM node:22.12-alpine3.20 AS builder
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
