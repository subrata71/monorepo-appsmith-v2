module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "/top/frontend",
      script: "node_modules/.bin/vite",
      args: "dev --host 0.0.0.0",
      interpreter: "/bin/sh",
      env: {
        __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: ".e2b.app",
      },
      log_file: "/top/logs/frontend.log",
      time: true,
      watch: false,
    },
    {
      name: "backend",
      cwd: "/top/backend",
      script: "node_modules/.bin/tsx",
      args: "watch src/server.ts",
      interpreter: "/bin/sh",
      log_file: "/top/logs/backend.log",
      time: true,
      watch: false,
    },
    {
      name: "caddy",
      cwd: "/top",
      script: "/usr/local/bin/caddy",
      args: "run --config e2b/Caddyfile",
      log_file: "/top/logs/caddy.log",
      watch: false,
    },
  ],
};
