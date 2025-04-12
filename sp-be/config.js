// server/config.js
const dev = true; // Toggle for environment

module.exports = {
    dev,
    provider: dev ? 'http://localhost:3000' : 'https://casualhorizons.com:4962', // frontend domain
    port: 4962,
    httpsOptions: {
        keyPath: '/etc/letsencrypt/live/casualhorizons.com/privkey.pem',
        certPath: '/etc/letsencrypt/live/casualhorizons.com/fullchain.pem',
    },
};