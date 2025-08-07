module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'server.js',
      watch: false,
      autorestart: true,
      windowsHide: true,
      env: {
        PORT: 3001
      }
    }
  ]
};
