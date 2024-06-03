import { useState } from 'react';
import { Button, TextField, Grid, Container, Typography, Box } from '@mui/material';
import { SearchUserList } from '../molecules/Users/SearchUsers';
import { SearchTweetList } from '../molecules/Tweets/SearchTweet';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../molecules/Tweets/PostTweet';

export const SearchComponent: React.FC = () => {
    const [searchWord, setSearchWord] = useState<string>('');
    const [fetchUsers, setFetchUsers] = useState<boolean>(false);
    const [fetchTweets, setFetchTweets] = useState<boolean>(false);
    const [refreshTweets, setRefreshTweets] = useState(false);
    const { userId } = useUser();

    const handleFetchUsers = () => {
        setFetchUsers(false);  
        setFetchTweets(false);
        setTimeout(() => {
            setFetchUsers(true); 
        }, 0);
    };

    const handleFetchTweets = () => {
        setFetchUsers(false);
        setFetchTweets(false);
        setTimeout(() => {
            setFetchTweets(true);
        }, 0);
    }

    const handleTweetPosted = () => {
        setRefreshTweets((prev) => !prev); // 状態をトグルしてリフレッシュをトリガー
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Search Page
            </Typography>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item xs={12}>
                    <TextField
                        type="text"
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        placeholder="Search..."
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleFetchUsers}
                            >
                                Search Users
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={handleFetchTweets}
                            >
                                Search Tweets
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {fetchUsers && <SearchUserList searchWord={searchWord} />}
                    {fetchTweets && <SearchTweetList searchWord={searchWord} refresh={refreshTweets} />}
                </Grid>
            </Grid>
            <Box position="fixed" bottom={110} right={16} zIndex={1000}>
                    <PostTweet userId={userId} onTweetPosted={handleTweetPosted}/>
            </Box>
        </Container>
    );
};