import React from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';

interface TweetContentProps {
    text: string;
    createdAt: string;
    picture: Blob | null;
    loadingPicture: boolean;
}

const TweetContent: React.FC<TweetContentProps> = ({ text, createdAt, picture, loadingPicture }) => {
    return (
        <Box style={{ width: '100%' }}>
            <Typography variant="body1" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                {text}
            </Typography>
            <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px' }}>
                {new Date(createdAt).toLocaleString()}
            </Typography>
            {loadingPicture ? (
                <CircularProgress size={24} />
            ) : (
                picture && (
                    <Box mt={2} style={{ width: '100%', textAlign: 'center' }}>
                        <img
                            src={URL.createObjectURL(picture)}
                            alt=""
                            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Box>
                )
            )}
        </Box>
    );
};

export default TweetContent;
