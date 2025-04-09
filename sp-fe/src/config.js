// client/src/config.js
const dev = true;

export const config = {
    dev,
    provider: dev ? 'http://localhost:4962' : 'https://casualhorizons.com:4962', // Backend Server
};
