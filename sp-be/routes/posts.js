const express = require('express');
const path = require('path');
const multer = require('multer');
const { db } = require('../db/db');
const { authenticateSession } = require('./moderators');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'));
        }
    },
});

// GET /api/posts
router.get('/', (req, res) => {
    const {
        sortField = 'timestamp',
        sortOrder = 'desc',
        filter = 'all',
        tags = '',
        page = 1,
        limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let filterCondition = 'WHERE hidden = 0'; // Default: hide flagged posts from everyone
    if (filter === 'flagged') {
        if (req.session && req.session.isAuthenticated) {
            filterCondition = 'WHERE hidden = 0';
        } else {
            return res.status(403).json({ error: 'Not authorized to view flagged posts' });
        }
    } else if (filter === 'unflagged') {
        filterCondition = 'WHERE hidden = 0';
    }

    const tagConditions = [];
    if (tags.trim()) {
        const tagList = tags.split(',').map(tag => tag.trim());
        tagList.forEach(tag => {
            tagConditions.push(`tags LIKE '%${tag}%'`);
        });
    }

    const tagCondition = tagConditions.length > 0
        ? (filterCondition ? ` AND (${tagConditions.join(' OR ')})` : `WHERE (${tagConditions.join(' OR ')})`)
        : '';

    const totalQuery = `SELECT COUNT(*) AS total FROM posts ${filterCondition} ${tagCondition}`;
    const postsQuery = `
        SELECT * FROM posts
        ${filterCondition} ${tagCondition}
        ORDER BY ${sortField} ${sortOrder.toUpperCase()}
        LIMIT ${limit} OFFSET ${offset}
    `;

    db.get(totalQuery, [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch post count' });
        const total = row.total;

        db.all(postsQuery, [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch posts' });

            res.json({
                posts: rows,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
            });
        });
    });
});

// GET /api/posts
router.get('/mod', (req, res) => {
    const {
        sortField = 'timestamp',
        sortOrder = 'desc',
        filter = 'all',
        tags = '',
        page = 1,
        limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let filterCondition = ''; // Default: hide flagged posts from everyone
    if (filter === 'flagged') {
        if (req.session && req.session.isAuthenticated) {
            filterCondition = 'WHERE hidden = 0';
        } else {
            return res.status(403).json({ error: 'Not authorized to view flagged posts' });
        }
    } else if (filter === 'unflagged') {
        filterCondition = 'WHERE hidden = 0';
    }

    const tagConditions = [];
    if (tags.trim()) {
        const tagList = tags.split(',').map(tag => tag.trim());
        tagList.forEach(tag => {
            tagConditions.push(`tags LIKE '%${tag}%'`);
        });
    }

    const tagCondition = tagConditions.length > 0
        ? (filterCondition ? ` AND (${tagConditions.join(' OR ')})` : `WHERE (${tagConditions.join(' OR ')})`)
        : '';

    const totalQuery = `SELECT COUNT(*) AS total FROM posts ${filterCondition} ${tagCondition}`;
    const postsQuery = `
        SELECT * FROM posts
        ${filterCondition} ${tagCondition}
        ORDER BY ${sortField} ${sortOrder.toUpperCase()}
        LIMIT ${limit} OFFSET ${offset}
    `;

    db.get(totalQuery, [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch post count' });
        const total = row.total;

        db.all(postsQuery, [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch posts' });

            res.json({
                posts: rows,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
            });
        });
    });
});

// POST /api/posts
router.post('/', upload.single('image'), (req, res) => {
    const { title, content, tags } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    db.all('SELECT word FROM disallowed_words', [], (err, words) => {
        if (err) return res.status(500).json({ error: 'Failed to validate content' });

        const disallowedWords = words.map(row => row.word);
        const hasDisallowedWords = disallowedWords.some(word =>
            content.toLowerCase().includes(word.toLowerCase())
        );

        if (hasDisallowedWords) {
            return res.status(400).json({ error: 'Content contains disallowed words' });
        }

        db.run(
            `INSERT INTO posts (title, content, image_path, tags, ip_address) VALUES (?, ?, ?, ?, ?)`,
            [title, content, imagePath, tags || '', ip],
            function (err) {
                if (err) return res.status(500).json({ error: 'Failed to insert post' });
                res.status(201).json({ id: this.lastID });
            }
        );
    });
});

// DELETE /api/posts/:id
router.delete('/:id', authenticateSession, (req, res) => {
    const postId = req.params.id;

    db.run(`DELETE FROM posts WHERE id = ?`, [postId], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete post.' });
        if (this.changes === 0) return res.status(404).json({ error: 'Post not found.' });

        res.status(200).json({ message: 'Post deleted successfully.' });
    });
});


// PATCH /api/posts/:id/flag
router.patch('/:id/flag', authenticateSession, (req, res) => {
    db.run(
        `UPDATE posts SET hidden = 1 WHERE id = ?`,
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to flag post.' });
            res.status(200).json({ message: 'Post flagged successfully.' });
        }
    );
});

// PATCH /api/posts/:id/unflag
router.patch('/:id/unflag', authenticateSession, (req, res) => {
    db.run(
        `UPDATE posts SET hidden = 0 WHERE id = ?`,
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to unflag post.' });
            res.status(200).json({ message: 'Post unflagged successfully.' });
        }
    );
});

// DELETE /api/posts/:id
router.delete('/:id', authenticateSession, (req, res) => {
    const postId = req.params.id;

    db.run(`DELETE FROM posts WHERE id = ?`, [postId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete post.' });
        }

        res.status(200).json({ message: 'Post deleted successfully.' });
    });
});


module.exports = router;
