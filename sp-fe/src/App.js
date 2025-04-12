import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    CssBaseline,
    Snackbar,
    Alert,
    Button,
    Typography
} from '@mui/material';
import ModeratorLogin from './components/ModeratorLogin';
import NavBar from './components/NavBar';
import CreatePost from './components/CreatePost';
import Home from './pages/Home';
import About from './pages/About';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import ModeratorDashboard from './pages/ModeratorDashboard';
import { config } from './config';

// Self explainatory App
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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // List of pfp's to select from and random way to fetch
    const getRandomProfileImage = (date) => {
        const defaultProfileImages = [
            '/images/pfp1.png',
            '/images/pfp2.png',
            '/images/pfp3.png',
            '/images/pfp4.png',
            '/images/pfp5.png',
            '/images/pfp6.png',
            '/images/pfp7.png',
        ];

        const seed = new Date(date).getTime();
        const index = Math.abs(seed % defaultProfileImages.length);
        return defaultProfileImages[index];
    };

    // grab certain posts that relate to filters and sorting
    const fetchPosts = () => {
        axios
            .get(`${config.provider}/api/posts`, {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchPosts = () => {
            axios
                .get(`${config.provider}/api/posts`, {
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
        //get tags to filter by
        const fetchTags = () => {
            axios
                .get(`${config.provider}/api/tags`)
                .then((res) => setTags(res.data))
                .catch((err) => console.error('Error fetching tags:', err));
        };
        //check moderators logged in session
        const checkSession = () => {
            axios
                .get(`${config.provider}/api/moderators/session`, { withCredentials: true }) // send credentials to api
                .then((res) => setIsModeratorLoggedIn(res.data.loggedIn))
                .catch((err) => console.error('Session check error:', err));
        };
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
    // toggle whether a post is hidden or not
    const handleToggleFlag = (id, isHidden) => {
        const url = `${config.provider}/api/posts/${id}/${isHidden ? 'unflag' : 'flag'}`;
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
    // handle sorting order of posts
    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };
    //logout method for moderators to securely erase session token
    const handleLogout = () => {
        axios
            .post(`${config.provider}/api/moderators/logout`, {}, { withCredentials: true })
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
    // return html
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <NavBar onNewPostClick={() => setIsCreatePostOpen(true)}
                    isModeratorLoggedIn={isModeratorLoggedIn}
                />

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
                                provider={config.provider}
                            />
                        }
                    />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/moderator"
                        element={
                            isModeratorLoggedIn ? (
                                <ModeratorDashboard />
                            ) : (
                                <Typography sx={{ mt: 4, textAlign: 'center', color: 'red' }}>
                                    Access denied. You must be logged in as a moderator.
                                </Typography>
                            )
                        }
                    />

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
