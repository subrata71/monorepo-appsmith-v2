#!/bin/sh

set -eux

apk add --no-cache curl || true

# Create /usr/local/bin directory first
mkdir -p /usr/local/bin

# Install Caddy
curl --location --fail 'https://github.com/caddyserver/caddy/releases/download/v2.10.0/caddy_2.10.0_linux_amd64.tar.gz' \
	| tar -C /usr/local/bin -xz caddy

# Install Node.js
mkdir -p node
arch="$(uname -m | sed 's/x86_64/x64/; s/aarch64/arm64/')"
curl -sS "https://nodejs.org/dist/latest/node-v24.4.1-linux-$arch.tar.gz" \
  | tar -xz -C node --strip-components 1

# Add node/bin to PATH for this session
export PATH="$PWD/node/bin:$PATH"

# Install PM2
npm install -g pm2

# Enable pnpm
corepack enable pnpm

# Now create symlinks for all node/bin executables (including newly installed pm2 and pnpm)
find "$PWD/node/bin" -maxdepth 1 -type f -exec ln -vsf '{}' /usr/local/bin/ ';'

# Test that tools are working via symlinks
node --version
pnpm --version
pm2 --version

# Install dependencies
cd backend && pnpm install --include=dev
cd frontend && pnpm install --include=dev
