import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

function ModeratorLogin({ open, onClose, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dev = true;
    const provider = dev ? 'http://localhost:4962' : 'https://casualhorizons.com:4962';

    const handleLogin = (e) => {
        e.preventDefault();

        axios
            .post(
                `${provider}/api/moderators/login`,
                { username, password },
                { withCredentials: true }
            )
            .then(() => {
                onLogin(); // Notify parent that login succeeded
                setUsername('');
                setPassword('');
                onClose(); // Close dialog
            })
            .catch((error) => {
                console.error('Login failed:', error.response?.data || error.message);
                alert('Login failed: Invalid credentials or server issue.');
            });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Moderator Login</DialogTitle>
            <form onSubmit={handleLogin}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        Login
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ModeratorLogin;
