const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { db } = require('../db/db');

// Middleware to protect moderator-only routes
const authenticateSession = (req, res, next) => {
    if (!req.session.moderatorId) {
        return res.status(403).json({ error: 'Access denied. You must be logged in as a moderator.' });
    }

    db.get(`SELECT * FROM moderators WHERE id = ?`, [req.session.moderatorId], (err, moderator) => {
        if (err || !moderator) {
            console.error('Moderator not found:', err || 'No moderator found');
            return res.status(403).json({ error: 'Invalid session or moderator not found.' });
        }

        req.moderator = moderator;
        next();
    });
};

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM moderators WHERE username = ?`, [username], async (err, moderator) => {
        if (err || !moderator) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, moderator.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Failed to regenerate session:', err);
                return res.status(500).json({ error: 'Failed to log in.' });
            }

            req.session.moderatorId = moderator.id;
            req.session.username = moderator.username;

            console.log('Moderator logged in:', req.session);
            res.status(200).json({ message: 'Logged in successfully.' });
        });
    });
});

// Session check
router.get('/session', (req, res) => {
    res.status(200).json({ loggedIn: !!req.session.moderatorId });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to log out.' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

module.exports = {
    router,
    authenticateSession
};
