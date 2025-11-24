FROM --platform=amd64 oven/bun as base

WORKDIR /app

# Instala fontes TrueType e fontconfig no Linux (Debian/Ubuntu-based image)
# - fonts-dejavu-core / fonts-liberation / fonts-noto-core cobrem a maioria dos scripts
# - fontconfig permite que bibliotecas encontrem as fontes do sistema
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       fontconfig \
       fonts-dejavu-core \
       fonts-liberation \
       fonts-noto-core \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN bun install

# Accept CORS allowed origins as build-time argument (optional)
ARG ALLOWED_ORIGINS
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS}

# run the app como usuário não root
USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "index.ts" ]
