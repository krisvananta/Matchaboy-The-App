module.exports = {
  apps: [
    {
      name: "matchaboy-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3001",
      env: {
        NODE_OPTIONS: "--experimental-require-module",
        PORT: 3001,
      },
    },
    {
      name: "matchaboy-tunnel",
      script: "node_modules/cloudflared/bin/cloudflared.exe",
      args: "tunnel --url http://localhost:3001",
      interpreter: "none",
    },
  ],
};
