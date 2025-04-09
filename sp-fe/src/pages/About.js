// pages/About.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: '#1e1e1e', p: 4, borderRadius: 2 }}>
        <Box>
            <Typography variant="h4" color="white" gutterBottom>
                About ShadowPost
            </Typography>
            <Typography variant="body1" color="white">
                ShadowPost is a place to post anonymous thoughts and share ideas with the world.
                Moderators help keep it clean and supportive. This page is just here so you can test routing.
            </Typography>
        </Box>
    </Container>
);

export default About;
