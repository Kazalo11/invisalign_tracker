# Build Stage
FROM node:22.12-alpine3.20 AS builder
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage
FROM nginx:alpine
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
