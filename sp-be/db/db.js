const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./db/posts.db', (err) => {
    if (err) console.error('DB Connection Error:', err.message);
    else console.log('✅ Connected to SQLite database.');
});

const initializeTables = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image_path TEXT,
            tags TEXT,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            hidden BOOLEAN DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS moderators (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS disallowed_words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL UNIQUE
        )
    `);
};

const createDefaultModerator = (shouldCreateMod = false) => {
    if (!shouldCreateMod) return;

    const defaultUser = 'user';
    const defaultPass = bcrypt.hashSync('pass', 10);

    db.run(
        `INSERT OR IGNORE INTO moderators (username, password) VALUES (?, ?)`,
        [defaultUser, defaultPass],
        (err) => {
            if (err) console.error('Error inserting default moderator:', err.message);
            else console.log('✅ Default moderator added.');
        }
    );
};

const loadDefaultTags = (shouldCreateTags = false) => {
    if (!shouldCreateTags) return;

    const tags = [
        "Image",
        "Rant",
        "Work",
        "TIL"
    ]
    // Insert default tags
    tags.forEach(tag => {
        db.run(
            `INSERT OR IGNORE INTO tags (name) VALUES (?)`,
            [tag],
            (err) => {
                if (err) console.error(`Error inserting tag '${tag}':`, err.message);
                else console.log(`✅ Tag '${tag}' added.`);
            }
        );
    });
};

module.exports = {
    db,
    initializeTables,
    createDefaultModerator,
    loadDefaultTags
};
