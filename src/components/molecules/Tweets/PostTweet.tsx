import React, { useState } from 'react';
import { createTweet } from '../../../backend_routes/api/tweets';
import NormalButton from '../../atoms/Buttons/NormalButton';
import NormalInput from '../../atoms/Inputs/NormalInput';
import { Container, Grid } from '@mui/material';

const PostTweet: React.FC<{ userId: string }> = ({ userId }) => {
    const [tweetText, setTweetText] = useState('');

    const handleTweetClick = async () => {
        try {
            const tweetId = await createTweet(userId, tweetText);
            console.log('Created tweet ID:', tweetId);
        } catch (error) {
            console.error('Failed to create tweet:', error);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                        <NormalInput
                            label="Tweet"
                            value={tweetText}
                            onChange={(e) => setTweetText(e.target.value)}
                            placeholder="Write a tweet..."
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <NormalButton onClick={handleTweetClick}>Tweet</NormalButton>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default PostTweet;
