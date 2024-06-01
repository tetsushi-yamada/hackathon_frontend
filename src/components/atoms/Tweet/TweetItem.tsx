import React, { useState, useEffect } from 'react';
import { fetchUser } from '../../../backend_routes/api/users';
import { getReplies } from '../../../backend_routes/api/tweets';
import { useUser } from '../../../contexts/UserContext';
import LikeButton from '../../atoms/Buttons/LikeButton';
import ReplyButton from '../../atoms/Buttons/ReplyButton';
import NormalButton from '../../atoms/Buttons/NormalButton';
import NormalInput from '../../atoms/Inputs/NormalInput';
import { List, ListItem, Typography, IconButton, Button, CircularProgress, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TweetWithUserName } from '../../../types/tweet.d';
import ProfilePicture from '../../molecules/Users/ProfilePictureGet';
import { Link } from 'react-router-dom';

interface TweetItemProps {
    tweet: TweetWithUserName;
    editTweetId: string | null;
    editTweetText: string;
    setEditTweetText: (text: string) => void;
    handleEditClick: (tweet_id: string, tweet_text: string) => void;
    handleSaveClick: () => void;
    handleDelete: (tweet_id: string) => void;
}

const TweetItem: React.FC<TweetItemProps> = ({
    tweet,
    editTweetId,
    editTweetText,
    setEditTweetText,
    handleEditClick,
    handleSaveClick,
    handleDelete
}) => {
    const { userId } = useUser();
    const [replies, setReplies] = useState<TweetWithUserName[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasReplies, setHasReplies] = useState(false);
    const [replyButtonClicked, setReplyButtonClicked] = useState(false);

    const checkReplies = async () => {
        try {
            const fetchedReplies = await getReplies(tweet.tweet_id);
            if (fetchedReplies && fetchedReplies.tweets.length > 0) {
                setHasReplies(true);
                const repliesWithUserName = await Promise.all(fetchedReplies.tweets.map(async (reply) => {
                    const user = await fetchUser(reply.user_id);
                    return {
                        ...reply,
                        user_name: user.user_name,
                    };
                }));
                setReplies(repliesWithUserName);
            } else {
                setHasReplies(false);
                setReplies([]);
            }
        } catch (error) {
            console.error(`Failed to check replies for tweetId: ${tweet.tweet_id}`, error);
        }
    };
    
    const fetchReplies = async () => {
        setLoadingReplies(true);
        try {
            const fetchedReplies = await getReplies(tweet.tweet_id);
            const repliesWithUserName = await Promise.all(fetchedReplies.tweets.map(async (reply) => {
                const user = await fetchUser(reply.user_id);
                return {
                    ...reply,
                    user_name: user.user_name,
                };
            }));
            setReplies(repliesWithUserName);
        } catch (error) {
            console.error(`Failed to fetch replies for tweetId: ${tweet.tweet_id}`, error);
        } finally {
            setLoadingReplies(false);
            setReplyButtonClicked(true);
        }
    };

    useEffect(() => {
        checkReplies();
    });


    return (
        <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '16px', borderBottom: '1px solid #ccc' }}>
            {editTweetId === tweet.tweet_id ? (
                <div style={{ width: '100%' }}>
                    <NormalInput
                        label="Edit Tweet"
                        value={editTweetText}
                        onChange={e => setEditTweetText(e.target.value)}
                    />
                    <NormalButton onClick={handleSaveClick} variant="contained" color="primary">
                        Save
                    </NormalButton>
                </div>
            ) : (
                <div style={{ width: '100%' }}>
                    <Link to={`/userpage/${tweet.user_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                        <Box mb={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <ProfilePicture user_id={tweet.user_id} radius={20} />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="body1" fontWeight="bold">
                                        {tweet.user_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        @{tweet.user_id}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                                {tweet.tweet_text}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px' }}>
                                {new Date(tweet.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </Link>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <LikeButton tweetId={tweet.tweet_id} userId={userId} />
                        <ReplyButton tweetId={tweet.tweet_id} userId={userId} onReplySubmitted={checkReplies} />
                        {tweet.user_id === userId && (
                            <>
                                <IconButton onClick={() => handleDelete(tweet.tweet_id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => handleEditClick(tweet.tweet_id, tweet.tweet_text)}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                        {hasReplies && (
                            <Button onClick={fetchReplies} size="small">
                                {loadingReplies ? <CircularProgress size={24} /> : 'Show Replies'}
                            </Button>
                        )}
                    </div>
                    {replyButtonClicked && hasReplies && replies.length > 0 && (
                        <List style={{ marginTop: '16px', width: '100%', backgroundColor: '#f9f9f9', padding: '8px' }}>
                            {replies.map(reply => (
                                <ListItem key={reply.tweet_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px', borderBottom: '1px solid #eee' }}>
                                    <Link to={`/userpage/${reply.user_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                                        <Box mb={2}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <ProfilePicture user_id={reply.user_id} radius={20} />
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {reply.user_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        @{reply.user_id}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Typography variant="body1" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                                                {reply.tweet_text}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px' }}>
                                                {new Date(reply.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Link>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                        <LikeButton tweetId={reply.tweet_id} userId={userId} />
                                        {reply.user_id === userId && (
                                            <>
                                                <IconButton onClick={() => handleDelete(reply.tweet_id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleEditClick(reply.tweet_id, reply.tweet_text)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </div>
            )}
        </ListItem>
    );
};

export default TweetItem;
