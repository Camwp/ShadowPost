// pages/Home.js
import React from 'react';
import { Container, Box, Pagination, Typography, Chip } from '@mui/material';
import PostList from '../components/PostList';

const Home = ({
    posts, tags, selectedTags, sortField, sortOrder,
    filterType, isModeratorLoggedIn, currentPage, totalPosts,
    handleTagClick, handleToggleFlag, handleSortChange, setCurrentPage, getRandomProfileImage, provider
}) => (
    <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#121212', p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mr: 2, color: '#ffffff' }}>
                Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                    <Chip
                        key={tag.id || index}
                        label={`#${tag.name || tag}`}
                        onClick={() => handleTagClick(tag.name || tag)}
                        sx={{
                            backgroundColor: selectedTags.includes(tag.name || tag) ? '#00b4d8' : '#1e1e1e',
                            color: '#ffffff',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </Box>
        </Box>

        <PostList
            posts={posts}
            isModeratorLoggedIn={isModeratorLoggedIn}
            handleToggleFlag={handleToggleFlag}
            getRandomProfileImage={getRandomProfileImage}
            provider={provider}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
                count={Math.ceil(totalPosts / 10)}
                page={currentPage}
                onChange={(e, val) => setCurrentPage(val)}
                color="primary"
            />
        </Box>
    </Container>
);

export default Home;
