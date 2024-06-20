import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from '../molecules/Users/ProfilePictureGet';
import { fetchUser } from '../../backend_routes/api/users';
import { User } from '../../types';
import { Settings } from '../atoms/Icons/SettingsIcon';
import GetTweetListByUserIdComponent from '../molecules/Tweets/GetTweetByUserId';
import { GetGoodsTweetListComponent } from '../molecules/Tweets/GetTweetByGoods';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../molecules/Tweets/PostTweet';
import { Grid, Typography, Box, Container, Tabs, Tab, IconButton, Paper, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LockIcon from '@mui/icons-material/Lock';
import GetFollows from '../molecules/Follow/getFollows';
import GetFollowers from '../molecules/Follow/getFollowers';

const UserPageComponent: React.FC<{ userID: string }> = ({ userID }) => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [refreshTweets, setRefreshTweets] = useState(false);
    const { userId } = useUser();

    useEffect(() => {
        const getUser = async () => {
            const user = await fetchUser(userID);
            setUser(user);
        };
        getUser();
    }, [userID]);

    const handleTweetPosted = () => {
        setRefreshTweets((prev) => !prev); // 状態をトグルしてリフレッシュをトリガー
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Profile
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <ProfilePicture user_id={userID} radius={40} />
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" fontWeight="bold">
                                {user?.user_name}
                            </Typography>
                            {user?.is_private && <LockIcon style={{ marginLeft: 4 }} />}
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                            @{user?.user_id}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton component={Link} to="/userpage/follow-requests">
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton component={Link} to="/userpage/settings">
                            <Settings />
                        </IconButton>
                    </Grid>
                </Grid>
                {user?.user_description && (
                    <Box mt={2}>
                        <Typography variant="body1">{user.user_description}</Typography>
                    </Box>
                )}
            </Paper>
            <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
                <Tab label="Tweets" />
                <Tab label="Goods" />
                <Tab label="Follows" />
                <Tab label="Followers" />
            </Tabs>
            <Divider sx={{ marginY: 2 }} />
            <Box my={4}>
                {selectedTab === 0 && <GetTweetListByUserIdComponent userId={userID} refresh={refreshTweets} />}
                {selectedTab === 1 && <GetGoodsTweetListComponent userId={userID} refresh={refreshTweets} />}
                {selectedTab === 2 && <GetFollows userID={userID} />}
                {selectedTab === 3 && <GetFollowers userID={userID} />}
            </Box>
            <Box position="fixed" bottom={110} right={16} zIndex={1000}>
                <PostTweet userId={userId} onTweetPosted={handleTweetPosted} />
            </Box>
        </Container>
    );
};

export default UserPageComponent;
