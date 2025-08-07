module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'server.js',
      watch: false,
      autorestart: true,
      windowsHide: true
    },
    {
      name: 'frontend',
      script: 'node_modules/http-server/bin/http-server',
      args: 'public -p 4000',
      autorestart: true,
      watch: false,
      windowsHide: true
    }
  ]
};
