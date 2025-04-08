const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const setupMiddleware = (app) => {
    const dev = true;

    app.use(cookieParser());
    app.use(bodyParser.json());

    app.use(cors({
        origin: [
            'http://localhost:3000',
            'https://wallwhisper.netlify.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.set('trust proxy', 1);

    app.use(
        session({
            secret: 'super-secret-key',
            resave: false,
            saveUninitialized: false,
            store: new SQLiteStore(), // ✅ persist session store
            cookie: {
                httpOnly: true, // ✅ very important!
                secure: !dev,    // true in production, false in dev
                sameSite: dev ? 'Lax' : 'None',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            },
        })
    );

    app.use('/uploads', require('express').static('uploads'));
};

module.exports = setupMiddleware;
