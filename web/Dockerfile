FROM node:22.12-alpine3.20 AS builder
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