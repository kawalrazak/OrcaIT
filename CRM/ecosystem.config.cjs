/** PM2 process manager config — run: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: 'careit-crm',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
