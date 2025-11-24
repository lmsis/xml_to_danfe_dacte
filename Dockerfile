FROM --platform=amd64 oven/bun as base

WORKDIR /app

COPY . .
RUN bun install

# run the app
USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "index.ts" ]
