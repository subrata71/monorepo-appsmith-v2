#!/bin/sh

cd /top

export PATH="$PWD/node/bin:$PATH"

exec sudo node/bin/pm2-runtime start e2b/ecosystem.config.js
