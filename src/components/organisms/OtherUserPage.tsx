import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfilePicture from '../molecules/Users/ProfilePictureGet';
import { fetchUser } from '../../backend_routes/api/users';
import { User } from '../../types';
import { Settings } from '../atoms/Icons/SettingsIcon';
import GetTweetListByUserIdComponent from '../molecules/Tweets/GetTweetByUserId';
import { GetGoodsTweetListComponent } from '../molecules/Tweets/GetTweetByGoods';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../molecules/Tweets/PostTweet';
import { Grid, Typography, Box, Container, Paper, Tabs, Tab } from '@mui/material';

const OtherUserPageComponent: React.FC = () => {
    const userID = useParams<{ userId: string }>().userId;
    const [user, setUser] = useState<User | null>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [refreshTweets, setRefreshTweets] = useState(false);
    const { userId } = useUser();

    useEffect(() => {
        if (userID) {
            const getUser = async () => {
                const user = await fetchUser(userID);
                setUser(user);
            };
            getUser();
        }
    }, [userID]);

    const handleTweetPosted = () => {
        setRefreshTweets((prev) => !prev); // 状態をトグルしてリフレッシュをトリガー
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <div>
            {userID === undefined ? (
                <h1>Invalid User ID</h1>
            ) : (
                <Container maxWidth="md">
                    <Box my={4}>
                        <Paper style={{ padding: '20px', margin: '20px' }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                User Page
                            </Typography>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <ProfilePicture user_id={userID} radius={30} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" fontWeight="bold">
                                        {user?.user_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        @{user?.user_id}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Link to="/userpage/settings">
                                        <Settings />
                                    </Link>
                                </Grid>
                            </Grid>
                            {user?.user_description ? (
                                <Box my={4}>
                                    <Typography variant="body1">{user.user_description}</Typography>
                                </Box>
                            ) : null}
                        </Paper>
                        <Paper style={{ padding: '20px', margin: '20px' }}>
                            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                                <Tab label="Tweets" />
                                <Tab label="Goods" />
                            </Tabs>
                            <Box my={4}>
                                {selectedTab === 0 && <GetTweetListByUserIdComponent userId={userID} refresh={refreshTweets} />}
                                {selectedTab === 1 && <GetGoodsTweetListComponent userId={userID} refresh={refreshTweets} />}
                            </Box>
                        </Paper>
                        <Box position="fixed" bottom={16} right={16}>
                            <PostTweet userId={userId} onTweetPosted={handleTweetPosted}/>
                        </Box>
                    </Box>
                </Container>
            )}
        </div>
    );
};

export default OtherUserPageComponent;
