import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePicture from '../molecules/Users/ProfilePictureGet';
import { fetchUser } from '../../backend_routes/api/users';
import { User } from '../../types';
import GetTweetListByUserIdComponent from '../molecules/Tweets/GetTweetByUserId';
import { GetGoodsTweetListComponent } from '../molecules/Tweets/GetTweetByGoods';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../molecules/Tweets/PostTweet';
import { Grid, Typography, Box, Container, Tabs, Tab, Paper, Divider } from '@mui/material';
import FollowButton from '../atoms/Buttons/FollowButton';
import { checkFollow } from '../../backend_routes/api/follow';
import LockIcon from '@mui/icons-material/Lock';
import GetFollows from '../molecules/Follow/getFollows';
import GetFollowers from '../molecules/Follow/getFollowers';
import BlockButton from '../atoms/Buttons/BlockButton';
import { checkBlock } from '../../backend_routes/api/block';

const OtherUserPageComponent: React.FC = () => {
    const { userId: userID } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [refreshTweets, setRefreshTweets] = useState(false);
    const [followOrNot, setFollowOrNot] = useState<boolean>(false);
    const [blockOrNot, setBlockOrNot] = useState<boolean>(false);
    const [reverseBlockOrNot, setReverseBlockOrNot] = useState<boolean>(false);
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

    useEffect(() => {
        const checkBlockStatus = async () => {
            try {
                if (userId && userID) {
                    const result = await checkBlock(userId, userID);
                    setBlockOrNot(result);
                }
            } catch (error) {
                console.error('Failed to check block status', error);
            }
        };
        checkBlockStatus();
    }, [userId, userID]);

    useEffect(() => {
        const checkReverseBlockStatus = async () => {
            try {
                if (userId && userID) {
                    const result = await checkBlock(userID, userId);
                    setReverseBlockOrNot(result);
                }
            } catch (error) {
                console.error('Failed to check reverse block status', error);
            }
        };
        checkReverseBlockStatus();
    }, [userId, userID]);

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
        };
        checkFollowStatus();
    }, [userId, userID]);

    const handleTweetPosted = () => {
        setRefreshTweets((prev) => !prev); // 状態をトグルしてリフレッシュをトリガー
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    if (!userID) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Invalid User ID
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (blockOrNot) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        User Page
                    </Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <ProfilePicture user_id={userID} radius={30} />
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
                            {user ? <FollowButton user={user} /> : null}
                        </Grid>
                        <Grid item>
                            {user && userId !== userID ? <BlockButton userID={user.user_id} /> : null}
                        </Grid>
                    </Grid>
                    {user?.user_description && (
                        <Box mt={2}>
                            <Typography variant="body1">{user.user_description}</Typography>
                        </Box>
                    )}
                    <Typography variant="h4">You have blocked this user.</Typography>
                </Box>
            </Container>
        );
    }

    if (reverseBlockOrNot) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        User Page
                    </Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <ProfilePicture user_id={userID} radius={30} />
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
                            {user ? <FollowButton user={user} /> : null}
                        </Grid>
                        <Grid item>
                            {user && userId !== userID ? <BlockButton userID={user.user_id} /> : null}
                        </Grid>
                    </Grid>
                    {user?.user_description && (
                        <Box mt={2}>
                            <Typography variant="body1">{user.user_description}</Typography>
                        </Box>
                    )}
                    <Typography variant="h4">This user has blocked you.</Typography>
                </Box>
            </Container>
        );
    }

    if (user?.is_private && !followOrNot && userId !== userID) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        User Page
                    </Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <ProfilePicture user_id={userID} radius={30} />
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
                            {user ? <FollowButton user={user} /> : null}
                        </Grid>
                        <Grid item>
                            {user && userId !== userID ? <BlockButton userID={user.user_id} /> : null}
                        </Grid>
                    </Grid>
                    {user?.user_description && (
                        <Box mt={2}>
                            <Typography variant="body1">{user.user_description}</Typography>
                        </Box>
                    )}
                    <Typography variant="h4">This account is private.</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Page
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
                            {user ? <FollowButton user={user} /> : null}
                        </Grid>
                        <Grid item>
                            {user && userId !== userID ? <BlockButton userID={user.user_id} /> : null}
                        </Grid>
                    </Grid>
                    {user?.user_description && (
                        <Box mt={2}>
                            <Typography variant="body1">{user.user_description}</Typography>
                        </Box>
                    )}
                </Paper>
                <Tabs value={selectedTab} onChange={handleTabChange} centered>
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
            </Box>
        </Container>
    );
};

export default OtherUserPageComponent;
