import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePicture from '../molecules/Users/ProfilePictureGet';
import { fetchUser } from '../../backend_routes/api/users';
import { User } from '../../types';
import GetTweetListByUserIdComponent from '../molecules/Tweets/GetTweetByUserId';
import { GetGoodsTweetListComponent } from '../molecules/Tweets/GetTweetByGoods';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../molecules/Tweets/PostTweet';
import { Grid, Typography, Box, Container, Tabs, Tab } from '@mui/material';
import FollowButton from '../atoms/Buttons/FollowButton';
import { checkFollow } from '../../backend_routes/api/follow';
import LockIcon from '@mui/icons-material/Lock';
import GetFollows from '../molecules/Follow/getFollows';
import GetFollowers from '../molecules/Follow/getFollowers';

const OtherUserPageComponent: React.FC = () => {
    const userID = useParams<{ userId: string }>().userId;
    const [user, setUser] = useState<User | null>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [refreshTweets, setRefreshTweets] = useState(false);
    const [followOrNot, setFollowOrNot] = useState<boolean>(false);
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

    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                if (userId && userID) {
                    const result = await checkFollow(userId, userID);
                    setFollowOrNot(result);
                }
            } catch (error) {
                console.error('Failed to check follow status', error);
            }
        }
        checkFollowStatus();
    }, [userId, userID]);

    if (user?.is_private && !followOrNot && userId !== userID) {
        return (
            <div>
                <Typography variant="h4">This account is private.</Typography>
            </div>
        );
    }

    return (
        <div>
            {userID === undefined ? (
                <h1>Invalid User ID</h1>
            ) : (
                <Container maxWidth="md">
                    <Box my={4}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            User Page
                        </Typography>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <ProfilePicture user_id={userID} radius={30} />
                            </Grid>
                            <Grid item>
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
                                {user ? <FollowButton user={user} /> : null}
                            </Grid>
                        </Grid>
                        {user?.user_description ? (
                            <Box my={4}>
                                <Typography variant="body1">{user.user_description}</Typography>
                            </Box>
                        ) : null}
                        <Tabs value={selectedTab} onChange={handleTabChange} centered>
                            <Tab label="Tweets" />
                            <Tab label="Goods" />
                            <Tab label="Follows" />
                            <Tab label="Followers" />
                        </Tabs>
                        <Box my={4}>
                            {selectedTab === 0 && <GetTweetListByUserIdComponent userId={userID} refresh={refreshTweets} />}
                            {selectedTab === 1 && <GetGoodsTweetListComponent userId={userID} refresh={refreshTweets} />}
                            {selectedTab === 2 && <GetFollows userID={userID} />}
                            {selectedTab === 3 && <GetFollowers userID={userID} />}
                        </Box>
                        <Box position="fixed" bottom={110} right={16} zIndex={1000}>
                            <PostTweet userId={userId} onTweetPosted={handleTweetPosted}/>
                        </Box>
                    </Box>
                </Container>
            )}
        </div>
    );
};

export default OtherUserPageComponent;
