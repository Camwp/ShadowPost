import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Alert,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import { config } from '../config'
function ModeratorDashboard() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');


    useEffect(() => {
        const fetchPosts = () => {
            axios
                .get(`${config.provider}/api/posts`, { withCredentials: true })
                .then((response) => {
                    let data = [];
                    if (Array.isArray(response.data)) {
                        data = response.data;
                    } else if (response.data.posts) {
                        data = response.data.posts;
                    } else {
                        setError('Unexpected response format');
                        return;
                    }

                    if (filter === 'flagged') {
                        setPosts(data.filter(post => post.hidden));
                    } else if (filter === 'visible') {
                        setPosts(data.filter(post => !post.hidden));
                    } else {
                        setPosts(data);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setError('Failed to fetch posts. Make sure you are logged in.');
                });
        };
        fetchPosts();
    }, [filter]);

    const fetchPosts = () => {
        axios
            .get(`${config.provider}/api/posts`, { withCredentials: true })
            .then((response) => {
                let data = [];
                if (Array.isArray(response.data)) {
                    data = response.data;
                } else if (response.data.posts) {
                    data = response.data.posts;
                } else {
                    setError('Unexpected response format');
                    return;
                }

                if (filter === 'flagged') {
                    setPosts(data.filter(post => post.hidden));
                } else if (filter === 'visible') {
                    setPosts(data.filter(post => !post.hidden));
                } else {
                    setPosts(data);
                }
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to fetch posts. Make sure you are logged in.');
            });
    };

    const deletePost = (id) => {
        axios
            .delete(`${config.provider}/api/posts/${id}`, { withCredentials: true })
            .then(() => fetchPosts())
            .catch((error) => {
                console.error(error);
                setError('Failed to delete post.');
            });
    };

    const toggleFlagPost = (id, currentHiddenState) => {
        const action = currentHiddenState ? 'unflag' : 'flag';
        axios
            .patch(`${config.provider}/api/posts/${id}/${action}`, {}, { withCredentials: true })
            .then(() => fetchPosts())
            .catch((error) => {
                console.error(error);
                setError(`Failed to ${action} post.`);
            });
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#121212', p: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>
                Moderator Dashboard
            </Typography>

            <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={handleFilterChange}
                sx={{ mb: 2 }}
            >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="flagged">Flagged</ToggleButton>
                <ToggleButton value="visible">Visible</ToggleButton>
            </ToggleButtonGroup>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {posts.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No posts to display.
                </Typography>
            ) : (
                posts.map((post) => (
                    <Card key={post.id} sx={{ mb: 2, backgroundColor: '#1e1e1e', color: '#ffffff' }}>
                        <CardContent>
                            <Typography variant="h6">{post.title || 'Untitled Post'}</Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>{post.content}</Typography>
                            {post.image_path && (
                                <Box
                                    component="img"
                                    src={`${config.provider}/${post.image_path}`}
                                    alt="Post"
                                    sx={{ width: '50%', mt: 2, borderRadius: 2, border: '1px solid #444' }}
                                />
                            )}
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => deletePost(post.id)}
                                >
                                    Delete Post
                                </Button>
                                <Button
                                    variant="outlined"
                                    color={post.hidden ? 'success' : 'warning'}
                                    onClick={() => toggleFlagPost(post.id, post.hidden)}
                                >
                                    {post.hidden ? 'Unflag' : 'Flag'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default ModeratorDashboard;
