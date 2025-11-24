FROM --platform=amd64 oven/bun as base

WORKDIR /app

COPY . .
RUN bun install

# Accept CORS allowed origins as build-time argument (optional)
ARG ALLOWED_ORIGINS
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS}

# run the app
USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "index.ts" ]
