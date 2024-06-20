import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, SelectChangeEvent, IconButton } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { generateTranslatedTweet } from '../../../backend_routes/api/openapi';
import { getTweetsByTweetID } from '../../../backend_routes/api/tweets';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const TranslateTweetButton: React.FC<{ tweetId: string }> = ({ tweetId }) => {
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState<string>('ja');
    const [translatedTweet, setTranslatedTweet] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        const fetchTweet = async () => {
            const response = await getTweetsByTweetID(tweetId);
            const tweet = await response;
            setText(tweet.tweet_text);
        };
        fetchTweet();
    }, [tweetId]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value as string);
    };

    const handleTranslate = async () => {
        setLoading(true);
        try {
            const translatedTweet = await generateTranslatedTweet(text, language);
            setTranslatedTweet(translatedTweet);
        } catch (error) {
            console.error('Error generating translated tweet:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <TranslateIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Translate Tweet
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="select-language-label">Language</InputLabel>
                        <Select
                            labelId="select-language-label"
                            id="select-language"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value="ja">Japanese</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="ko">Korean</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleTranslate}
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Translate'}
                    </Button>
                    {translatedTweet && (
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {translatedTweet}
                        </Typography>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default TranslateTweetButton;
