import React, { useState, useEffect } from 'react';
import { createTweet } from '../../../backend_routes/api/tweets';
import { uploadTweetPicture } from '../../../backend_routes/api/tweet_picture';
import { Container, Grid, IconButton, Dialog, DialogContent, Button, TextField, Input, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { checkTweetForInappropriateness } from '../../../backend_routes/api/openapi';
import './PostTweet.css'; // 追加

interface PostTweetProps {
    userId: string;
    onTweetPosted?: () => void; // ツイート完了後のコールバック
}

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
    },
}));

const CustomInput = styled(Input)(({ theme }) => ({
    display: 'none',
}));

const Label = styled('label')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    display: 'inline-block',
    cursor: 'pointer',
    textAlign: 'center',
}));

const PostTweet: React.FC<PostTweetProps> = ({ userId, onTweetPosted }) => {
    const [tweetText, setTweetText] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showBird, setShowBird] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === 'T') {
                event.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleTweetClick = async () => {
        if (tweetText.trim() === '' || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const inappropriate = await checkTweetForInappropriateness(tweetText);
            const tweetId = await createTweet(userId, tweetText, inappropriate);
            console.log('Created tweet ID:', tweetId);

            if (selectedFile) {
                await uploadTweetPicture(selectedFile, tweetId);
                console.log('Tweet picture uploaded successfully');
            }

            setTweetText('');
            setSelectedFile(null);
            setPreview(null);
            setOpen(false);
            if (onTweetPosted && typeof onTweetPosted === 'function') {
                onTweetPosted();
            }

            // 鳥のアニメーションをトリガー
            setShowBird(true);
            setTimeout(() => {
                setShowBird(false);
            }, 2000); // アニメーションの持続時間と一致させる
        } catch (error) {
            console.error('Failed to create tweet:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTweetText('');
        setSelectedFile(null);
        setPreview(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Grid container spacing={2} justifyContent="flex-end">
                    <IconButton
                        onClick={() => setOpen(true)}
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            position: 'fixed',
                            zIndex: 1000,
                            bottom: 60,
                            right: 16,
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <Box sx={{ padding: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <CustomTextField
                                        label="Tweet"
                                        value={tweetText}
                                        onChange={(e) => setTweetText(e.target.value)}
                                        placeholder="Write a tweet..."
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        maxRows={10}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomInput
                                        type="file"
                                        onChange={handleFileChange}
                                        inputProps={{ accept: 'image/*' }}
                                        id="upload-button"
                                    />
                                    <Label htmlFor="upload-button">
                                        <IconButton component="span" style={{ marginRight: '8px' }}>
                                            <PhotoCamera />
                                        </IconButton>
                                        Upload an image
                                    </Label>
                                </Grid>
                                {preview && (
                                    <Grid item xs={12}>
                                        <Box
                                            component="img"
                                            src={preview}
                                            alt="Image preview"
                                            sx={{ width: '100%', height: 'auto', borderRadius: 1, mt: 2 }}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button
                                        onClick={handleTweetClick}
                                        disabled={tweetText.trim() === '' || isSubmitting}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Tweet'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Container>
            {showBird && <img src="/bird.png" alt="Bird" className="bird" />} {/* 鳥の画像 */}
        </div>
    );
};

export default PostTweet;
