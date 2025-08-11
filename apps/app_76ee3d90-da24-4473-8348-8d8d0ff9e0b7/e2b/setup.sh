#!/bin/sh

set -eux

apt-get update && apt-get install -y curl || true

# Create /usr/local/bin directory first
mkdir -p /usr/local/bin

# Install Caddy
curl --location --fail 'https://github.com/caddyserver/caddy/releases/download/v2.10.0/caddy_2.10.0_linux_amd64.tar.gz' \
	| tar -C /usr/local/bin -xz caddy

# Install Node.js
mkdir -p node
arch="$(uname -m | sed 's/x86_64/x64/; s/aarch64/arm64/')"
curl -sS "https://nodejs.org/dist/v24.4.1/node-v24.4.1-linux-$arch.tar.gz" \
  | tar -xz -C node --strip-components 1

# Add node/bin to PATH for this session
export PATH="$PWD/node/bin:$PATH"

# Install PM2
npm install -g pm2

# Enable pnpm with specific version (non-interactive)
# Backend requires pnpm "~10.13.0" (see backend/package.json engines field)
# corepack enable alone downloads latest which fails the requirement
# So we use corepack prepare to install the exact compatible version
COREPACK_ENABLE_AUTO_PIN=0 corepack enable pnpm
corepack prepare pnpm@10.13.1 --activate

# Create symlinks for all node/bin executables (including pm2 and pnpm)
# include both files (-type f) and symlinks (-type l)
find "$PWD/node/bin" -maxdepth 1 \( -type f -o -type l \) -exec ln -vsf '{}' /usr/local/bin/ ';'

# Test that tools are working via symlinks
node --version
pnpm --version
pm2 --version

# Install dependencies
cd /top/backend && pnpm install --include=dev
cd /top/frontend && pnpm install --include=dev
