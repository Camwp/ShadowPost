# Overview

I created this web app to sharpen my full-stack development skills by building a real-world content moderation and ANONYMOUS discussion platform. The project combines a custom backend, secure login and session handling, image upload, and a dynamic frontend interface to simulate a lightweight community posting board with admin tools.

To start a test server on your computer:
1. Clone the repository.
2. Run `npm install` in both the backend and frontend folders.
3. In the backend folder, run:  
   `node index.js` or `npm run dev`  
4. In the frontend folder (React app), run:  
   `npm start`
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the app.

This software was written to explore how to implement authentication, image handling, RESTful APIs, and dynamic filtering. The backend uses SQLite for a lightweight database and includes a moderator login system that persists across sessions.

[Software Demo Video](https://www.youtube.com/watch?v=Cs-CzqB6SYA)

# Web Pages

- **Home Page (`/`)**  
  Displays a paginated list of posts with optional images, tags, and timestamps. Posts can be filtered by tag or sorted by date. Logged-in moderators can flag or unflag inappropriate content directly from the UI.

- **About Page (`/about`)**  
  A static informational page describing the app's purpose and how users can participate.

- **Moderator Login (Modal)**  
  A login dialog using `express-session` for authentication. Once logged in, users can flag posts and access the dashboard.

- **Moderator Dashboard (`/moderator`)**  
  A private page that lists all posts with advanced moderation tools, including delete, flag, and unflag actions. Posts are dynamically filtered by visibility (all, flagged, or visible).

- **Post Creation (Modal)**  
  Allows any user to submit a post with an optional title, message, tags, and image. File uploads are handled using Multer and stored in the `/uploads` directory.

# Development Environment

- **Frontend**:
  - React (with functional components and hooks)
  - Material-UI (MUI) for responsive and styled components
  - Axios for API requests

- **Backend**:
  - Node.js + Express
  - SQLite for persistent storage
  - `express-session` and `connect-sqlite3` for user sessions
  - Multer for image upload handling

- **Tools**:
  - VS Code
  - Postman (for API testing)
  - Git + GitHub

# Useful Websites

* [React Docs](https://reactjs.org)
* [Material UI](https://mui.com/)
* [Express Documentation](https://expressjs.com/)
* [SQLite Docs](https://www.sqlite.org/docs.html)
* [Multer File Upload Docs](https://github.com/expressjs/multer)
* [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# Future Work

* Add comment system for posts  
* Implement user profiles and avatars  
* Add email verification for moderators  
* Improve mobile responsiveness  
* Add server-side input validation and rate limiting  
* Enable post edit functionality
