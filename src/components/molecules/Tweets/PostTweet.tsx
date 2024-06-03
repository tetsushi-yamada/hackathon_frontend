import React, { useState } from 'react';
import { createTweet } from '../../../backend_routes/api/tweets';
import { Container, Grid, IconButton, Dialog, DialogContent, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PostTweetProps {
    userId: string;
    onTweetPosted?: () => void; // ツイート完了後のコールバック
}

const PostTweet: React.FC<PostTweetProps> = ({ userId, onTweetPosted }) => {
    const [tweetText, setTweetText] = useState('');
    const [open, setOpen] = useState(false);

    const handleTweetClick = async () => {
        if (tweetText.trim() === '') return;

        try {
            const tweetId = await createTweet(userId, tweetText);
            console.log('Created tweet ID:', tweetId);
            setTweetText('');
            setOpen(false);
            if (onTweetPosted && typeof onTweetPosted === 'function'){
                onTweetPosted(); 
            }
        } catch (error) {
            console.error('Failed to create tweet:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTweetText('');
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Grid container spacing={2} justifyContent="flex-end">
                    <IconButton
                        onClick={handleOpen}
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            position: 'fixed',
                            zIndex: 1000,
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    label="Tweet"
                                    value={tweetText}
                                    onChange={(e) => setTweetText(e.target.value)}
                                    placeholder="Write a tweet..."
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={10}
                                    style={{ resize: 'none' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleTweetClick}
                                    disabled={tweetText.trim() === ''}
                                >
                                    Tweet
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Container>
        </div>
    );
};

export default PostTweet;
