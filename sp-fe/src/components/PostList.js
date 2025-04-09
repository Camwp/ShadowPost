import React from 'react';
import {
    Grid, Card, CardHeader, CardContent,
    Avatar, Typography, Box, Chip, Button
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const PostList = ({
    posts,
    isModeratorLoggedIn,
    handleToggleFlag,
    getRandomProfileImage,
    provider
}) => {
    return (
        <Grid container spacing={3}>
            {posts.map((post) => (
                <Grid item xs={12} key={post.id}>
                    <Card sx={{ backgroundColor: '#1e1e1e', color: '#ffffff', borderRadius: 2, padding: 2 }}>
                        <CardHeader
                            avatar={<Avatar src={getRandomProfileImage(new Date(post.timestamp + 'Z').toLocaleString())} />}
                            title={
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                    {post.title || 'Untitled Post'}
                                </Typography>
                            }
                            subheader={
                                <Box display="flex" alignItems="center">
                                    <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(post.timestamp + 'Z').toLocaleString()
                                        }
                                    </Typography>

                                </Box>
                            }
                        />
                        <CardContent>
                            <Typography variant="body1" sx={{ color: '#dddddd' }}>
                                {post.content}
                            </Typography>

                            {post.tags && post.tags.trim() && (
                                <Box mt={2}>
                                    {post.tags.split(',').map((tag, i) => (
                                        <Chip
                                            key={i}
                                            label={`#${tag.trim()}`}
                                            sx={{ mr: 1, mb: 1, backgroundColor: '#00b4d8', color: '#ffffff' }}
                                        />
                                    ))}
                                </Box>
                            )}

                            {post.image_path && (
                                <Box component="img"
                                    src={`${provider}/${post.image_path}`}
                                    alt="Post"
                                    sx={{ maxWidth: '50%', mt: 2, borderRadius: 2, border: '1px solid #444' }}
                                />
                            )}

                            {isModeratorLoggedIn && (
                                <Button
                                    variant="outlined"
                                    color={post.hidden ? 'success' : 'error'}
                                    onClick={() => handleToggleFlag(post.id, post.hidden)}
                                    sx={{ mt: 2 }}
                                >
                                    {post.hidden ? 'Unflag' : 'Flag as Hidden'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PostList;
