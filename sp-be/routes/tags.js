const express = require('express');
const { db } = require('../db/db');

const router = express.Router();



router.get('/tags', (req, res) => {
    db.all('SELECT * FROM tags ORDER BY name ASC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching tags:', err.message);
            return res.status(500).send({ error: 'Failed to fetch tags' });
        }
        res.json(rows);
    });
});


module.exports = {
    router
};
