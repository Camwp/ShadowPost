import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Button, Box } from '@mui/material';

function ModeratorDashboard() {
    const [posts, setPosts] = useState([]);
    //CANGE TO TRUE WHILE EDITING
    const dev = false;
    let provider;
    if (dev) {
        provider = "http://localhost:4962"
    } else {
        provider = "https://casualhorizons.com:4962"
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios.get(`${provider}/api/posts`, {
            withCredentials: true,
        })

            .then((response) => setPosts(response.data))
            .catch((error) => console.error(error));
    };

    const deletePost = (id) => {
        axios.delete(`${provider}/api/posts/${id}`, {
            withCredentials: true,
        })

            .then(() => fetchPosts())
            .catch((error) => console.error(error));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Moderator Dashboard
            </Typography>
            {posts.map((post) => (
                <Card key={post.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="body1">{post.content}</Typography>
                        {post.image_path && (
                            <Box component="img" src={`${provider}/${post.image_path}`} alt="Post" />
                        )}
                        <Button variant="contained" color="error" onClick={() => deletePost(post.id)}>
                            Delete Post
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}

export default ModeratorDashboard;
