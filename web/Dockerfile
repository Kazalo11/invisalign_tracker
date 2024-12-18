FROM node:22.12-alpine3.20 AS builder
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM busybox:1.30 AS runner
WORKDIR /app
COPY --from=builder /usr/src/app/dist .
EXPOSE 3000
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]