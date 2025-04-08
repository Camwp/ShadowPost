import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    CssBaseline,
    Snackbar,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import ModeratorLogin from './components/ModeratorLogin';
import NavBar from './components/NavBar';
import CreatePost from './components/CreatePost';
import Home from './pages/Home';
import About from './pages/About';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortField, setSortField] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isModeratorLoggedIn, setIsModeratorLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const dev = true;
    const provider = dev ? 'http://localhost:4962' : 'https://casualhorizons.com:4962';

    const defaultProfileImages = [
        '/images/pfp1.png',
        '/images/pfp2.png',
        '/images/pfp3.png',
        '/images/pfp4.png',
        '/images/pfp5.png',
        '/images/pfp6.png',
        '/images/pfp7.png',
    ];

    const getRandomProfileImage = () => {
        return defaultProfileImages[Math.floor(Math.random() * defaultProfileImages.length)];
    };

    const fetchPosts = () => {
        axios
            .get(`${provider}/api/posts`, {
                params: {
                    sortField,
                    sortOrder,
                    filter: filterType,
                    tags: selectedTags.join(','),
                    page: currentPage,
                    limit: 10,
                },
                withCredentials: true,
            })

            .then((res) => {
                const { posts = [], total = 0 } = res.data;
                setPosts(posts);
                setTotalPosts(total);
            })
            .catch((err) => {
                console.error('Error fetching posts:', err);
                setPosts([]);
            });
    };

    const fetchTags = () => {
        axios
            .get(`${provider}/api/tags`)
            .then((res) => setTags(res.data))
            .catch((err) => console.error('Error fetching tags:', err));
    };

    const checkSession = () => {
        axios
            .get(`${provider}/api/moderators/session`, { withCredentials: true })
            .then((res) => setIsModeratorLoggedIn(res.data.loggedIn))
            .catch((err) => console.error('Session check error:', err));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchPosts();
        fetchTags();
        checkSession();
    }, [sortField, sortOrder, filterType, selectedTags, currentPage]);

    const handleTagClick = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
        setCurrentPage(1);
    };

    const handleToggleFlag = (id, isHidden) => {
        const url = `${provider}/api/posts/${id}/${isHidden ? 'unflag' : 'flag'}`;
        axios
            .patch(url, {}, { withCredentials: true })
            .then(() => {
                setSnackbarMessage(`Post ${isHidden ? 'unflagged' : 'flagged'} successfully!`);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                fetchPosts();
            })
            .catch(() => {
                setSnackbarMessage(`Failed to ${isHidden ? 'unflag' : 'flag'} post.`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const handleLogin = () => {
        axios
            .post(`${provider}/api/moderators/login`, { username, password }, { withCredentials: true })
            .then(() => {
                setIsModeratorLoggedIn(true);
                setIsLoginOpen(false);
                setUsername('');
                setPassword('');
                setSnackbarMessage('Logged in successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(() => {
                setSnackbarMessage('Invalid username or password');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleLogout = () => {
        axios
            .post(`${provider}/api/moderators/logout`, {}, { withCredentials: true })
            .then(() => {
                setIsModeratorLoggedIn(false);
                setSnackbarMessage('Logged out successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(() => {
                setSnackbarMessage('Failed to log out');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <NavBar onNewPostClick={() => setIsCreatePostOpen(true)} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                posts={posts}
                                tags={tags}
                                selectedTags={selectedTags}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                filterType={filterType}
                                isModeratorLoggedIn={isModeratorLoggedIn}
                                currentPage={currentPage}
                                totalPosts={totalPosts}
                                handleTagClick={handleTagClick}
                                handleToggleFlag={handleToggleFlag}
                                handleSortChange={handleSortChange}
                                setCurrentPage={setCurrentPage}
                                getRandomProfileImage={getRandomProfileImage}
                                provider={provider}
                            />
                        }
                    />
                    <Route path="/about" element={<About />} />
                </Routes>

                <CreatePost
                    open={isCreatePostOpen}
                    onClose={() => setIsCreatePostOpen(false)}
                    refreshPosts={fetchPosts}
                />

                <Button
                    onClick={() => (isModeratorLoggedIn ? handleLogout() : setIsLoginOpen(true))}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: isModeratorLoggedIn ? '#e63946' : '#121212',
                        color: '#ffffff',
                        borderRadius: '50%',
                        fontWeight: 'bold',
                    }}
                >
                    {isModeratorLoggedIn ? 'Logout' : 'Login'}
                </Button>



                <ModeratorLogin
                    open={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onLogin={() => {
                        setIsModeratorLoggedIn(true);
                        setSnackbarMessage('Logged in successfully!');
                        setSnackbarSeverity('success');
                        setSnackbarOpen(true);
                    }}
                />


                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Router>
        </ThemeProvider>
    );
};

export default App;
