import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import axios from 'axios';
import { provider } from '../config';

function CreatePost({ open, onClose, refreshPosts }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);


    useEffect(() => {
        axios.get(`${provider}/api/tags`)
            .then((response) => setTags(response.data.map(tag => tag.name)))
            .catch((error) => console.error('Error fetching tags:', error));
    }, [provider]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', message);
        formData.append('tags', selectedTags.join(','));
        if (image) formData.append('image', image);

        axios
            .post(`${provider}/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true, // ✅ Include cookies (session ID)
            })
            .then(() => {
                setTitle('');
                setMessage('');
                setSelectedTags([]);
                setImage(null);
                refreshPosts(); // Refresh posts in the parent component
                onClose(); // Close the dialog
            })
            .catch((error) => {
                console.error('Error creating post:', error);
                alert('Failed to create post. Please try again.');
            });
    };


    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{ maxLength: 250 }}
                    sx={{ mb: 2 }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                    {title.length}/250 characters
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    label="Message (required)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    inputProps={{ maxLength: 2000 }}
                    sx={{ mb: 2 }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                    {message.length}/2000 characters
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Tags (optional)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={`#${tag}`}
                            onClick={() => handleTagToggle(tag)}
                            color={selectedTags.includes(tag) ? 'primary' : 'default'}
                            clickable
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 3 }}
                >
                    Upload Image
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreatePost;
