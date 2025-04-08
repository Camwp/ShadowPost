// components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = ({ onNewPostClick }) => (
    <AppBar position="sticky" sx={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Wall-Whisper
            </Typography>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/about" color="inherit">About</Button>
            <Button
                variant="contained"
                color="primary"
                onClick={onNewPostClick}
                sx={{ borderRadius: '20px', fontWeight: 'bold', ml: 2 }}
            >
                New Post
            </Button>
        </Toolbar>
    </AppBar>
);

export default NavBar;
