#build stage
FROM golang:1.23-alpine AS builder
LABEL org.opencontainers.image.source=https://github.com/Kazalo11/invisalign_tracker
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/app

#run stage
FROM debian:bullseye-slim
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/server /server
EXPOSE 8080
CMD ["/server", "serve", "--http=0.0.0.0:8080"]