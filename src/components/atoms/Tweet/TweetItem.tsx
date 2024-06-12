import React, { useState, useEffect, useCallback } from 'react';
import { getTweetsByTweetID, getReplies, updateTweet } from '../../../backend_routes/api/tweets';
import { checkFollow } from '../../../backend_routes/api/follow';
import { getTweetPicture } from '../../../backend_routes/api/tweet_picture';
import { fetchUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import ProfileHeader from './ProfileHeader';
import TweetContent from './TweetContent';
import TweetActions from './TweetActions';
import RepliesList from './RepliesList';
import { TweetWithUserName } from '../../../types/tweet.d';
import { User } from '../../../types';
import NormalInput from '../Inputs/NormalInput';
import NormalButton from '../Buttons/NormalButton';
import { Box, ListItem } from '@mui/material';

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
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [replies, setReplies] = useState<TweetWithUserName[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasReplies, setHasReplies] = useState(false);
    const [replyButtonClicked, setReplyButtonClicked] = useState(false);
    const [tweetPicture, setTweetPicture] = useState<Blob | null>(null);
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [editReplyId, setEditReplyId] = useState<string | null>(null);
    const [editReplyText, setEditReplyText] = useState<string>('');
    const [originalTweet, setOriginalTweet] = useState<TweetWithUserName | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await fetchUser(tweet.user_id);
            setUser(user);
        };
        getUser();
    }, [tweet.user_id]);

    const checkFollowStatus = useCallback(async () => {
        if (userId && tweet.user_id) {
            const result = await checkFollow(userId, tweet.user_id);
            setIsFollowing(result);
        }
    }, [userId, tweet.user_id]);

    useEffect(() => {
        checkFollowStatus();
    }, [checkFollowStatus]);

    const checkReplies = useCallback(async () => {
        try {
            const fetchedReplies = await getReplies(tweet.tweet_id);
            if (fetchedReplies && fetchedReplies.tweets && fetchedReplies.tweets.length > 0) {
                const repliesWithUserName = await Promise.all(fetchedReplies.tweets.map(async (reply) => {
                    const user = await fetchUser(reply.user_id);
                    if (userId === reply.user_id) {
                        return {
                            ...reply,
                            user_name: user.user_name,
                        };
                    } else if (user.is_private) {
                        const isFollowing = await checkFollow(userId, reply.user_id);
                        if (isFollowing) {
                            return {
                                ...reply,
                                user_name: user.user_name,
                            };
                        } else {
                            return null;
                        }
                    }else{
                        return {
                            ...reply,
                            user_name: user.user_name,
                        };
                    }
                }));
                const nonNullReplies = repliesWithUserName.filter((reply): reply is TweetWithUserName => reply !== null);
                setReplies(nonNullReplies);
                if (nonNullReplies.length > 0) {
                    setHasReplies(true);
                } else {
                    setHasReplies(false);
                    setReplyButtonClicked(false);
                    setReplies([]);
                }
            } else {
                setHasReplies(false);
                setReplyButtonClicked(false);
                setReplies([]);
            }
        } catch (error) {
            setHasReplies(false);
            setReplyButtonClicked(false);
            setReplies([]);
            console.error(`Failed to check replies for tweetId: ${tweet.tweet_id}`, error);
        }
    }, [tweet.tweet_id, userId]);

    const fetchReplies = useCallback(async () => {
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
    }, [tweet.tweet_id]);

    const handleReplyEditClick = (tweet_id: string, tweet_text: string) => {
        setEditReplyId(tweet_id);
        setEditReplyText(tweet_text);
    }

    const handleReplySaveClick = useCallback(async () => {
        if (!editReplyId) return;
        await updateTweet(editReplyId, editReplyText);
        setEditReplyId(null);
        setEditReplyText('');
    }, [editReplyId, editReplyText]);

    useEffect(() => {
        checkReplies();
    });

    useEffect(() => {
        const loadTweetPicture = async () => {
            setLoadingPicture(true);
            try {
                const pictureBlob = await getTweetPicture(tweet.tweet_id);
                if (pictureBlob.size > 0) {
                    setTweetPicture(pictureBlob);
                } else {
                    setTweetPicture(null);
                }
            } catch (error) {
                console.error('Error fetching tweet picture:', error);
                setTweetPicture(null);
            } finally {
                setLoadingPicture(false);
            }
        };

        loadTweetPicture();
    }, [tweet.tweet_id]);

    useEffect(() => {
        const fetchOriginalTweet = async () => {
            if (tweet.retweet_id) {
                try {
                    const originalTweetData = await getTweetsByTweetID(tweet.retweet_id);
                    const user = await fetchUser(originalTweetData.user_id);
                    const originalTweetDataWithUserName = {
                        ...originalTweetData,
                        user_name: user.user_name,
                    };
                    setOriginalTweet(originalTweetDataWithUserName);
                } catch (error) {
                    console.error('Failed to fetch original tweet:', error);
                }
            } else {
                setOriginalTweet(null);
            }
        };

        fetchOriginalTweet();
    }, [tweet.retweet_id]);

    if (userId !== tweet.user_id && user?.is_private && !isFollowing) {
        return null; // フォローしていない場合は何も表示しない
    }

    return (
        <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '16px', borderBottom: '1px solid #ccc', position: 'relative', zIndex: 10 }}>
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
                    <ProfileHeader userId={tweet.user_id} />
                    <TweetContent text={tweet.tweet_text} createdAt={tweet.created_at} picture={tweetPicture} loadingPicture={loadingPicture} />
                    {originalTweet && (
                        <Box mt={2} p={2} style={{ backgroundColor: '#f0f0f0', borderRadius: '8px', width: '100%' }}>
                            <ProfileHeader userId={originalTweet.user_id} />
                            <TweetContent text={originalTweet.tweet_text} createdAt={originalTweet.created_at} picture={tweetPicture} loadingPicture={loadingPicture} />
                        </Box>
                    )}
                    <TweetActions
                        tweetId={tweet.tweet_id}
                        userId={userId}
                        hasReplies={hasReplies}
                        loadingReplies={loadingReplies}
                        onReplySubmitted={checkReplies}
                        onFetchReplies={fetchReplies}
                        onDelete={() => handleDelete(tweet.tweet_id)}
                        onEditClick={() => handleEditClick(tweet.tweet_id, tweet.tweet_text)}
                        showRetweetButton={!user?.is_private} // 鍵垢の場合はリツイートボタンを非表示にする
                    />
                    {replyButtonClicked && hasReplies && replies.length > 0 && (
                        <RepliesList
                            replies={replies}
                            editReplyId={editReplyId}
                            editReplyText={editReplyText}
                            setEditReplyText={setEditReplyText}
                            handleReplyEditClick={handleReplyEditClick}
                            handleReplySaveClick={handleReplySaveClick}
                            handleDelete={handleDelete}
                            hasReplies={hasReplies}
                            setHasReplies={setHasReplies}
                        />
                    )}
                </div>
            )}
        </ListItem>
    );
};

export default TweetItem;
