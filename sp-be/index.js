const express = require('express');
const config = require('./config');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const app = express();
const fs = require('fs');
dotenv.config();


// Dev: True or False
const devProvider = true;
const PORT = 4962;
const DEVPORT = 4962;
let provider;
if (devProvider) {
    provider = "http://localhost:3000"
} else {
    provider = "https://casualhorizons.com:3000"
}


// Setup Middleware
const setupMiddleware = require('./middleware/middleware');
setupMiddleware(app);

// Setup DB and Initialize tables if not existing
const { db, initializeTables, createDefaultModerator, loadDefaultTags } = require('./db/db');
initializeTables();
loadDefaultTags();
createDefaultModerator(false); // Set to true if needed



// Use uploads folder for images
app.use('/uploads', express.static('uploads'));

// Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const { router: modRoutes } = require('./routes/moderators');
app.use('/api/moderators', modRoutes);

const { router: tagRoutes } = require('./routes/tags');
app.use('/api', tagRoutes);
// End Routes





if (devProvider) {
    // Start the HTTP server
    http.createServer(app).listen(config.port, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${config.port}/`);
    });
} else {
    // Start the HTTPS server
    const httpsOptions = {
        key: fs.readFileSync(config.httpsOptions.keyPath),
        cert: fs.readFileSync(config.httpsOptions.certPath)
    };

    const server = https.createServer(httpsOptions, app);
    server.listen(config.port, '0.0.0.0', () => {
        console.log(`Server running on https://0.0.0.0:${PORT}/`);
    });

}

