import React, { useState, useEffect, useCallback } from 'react';
import { getTweetsByTweetID, getReplies, updateTweet } from '../../../backend_routes/api/tweets';
import { getTweetPicture } from '../../../backend_routes/api/tweet_picture';
import { fetchUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import ProfileHeader from './ProfileHeader';
import TweetContent from './TweetContent';
import TweetActions from './TweetActions';
import RepliesList from './RepliesList';
import { TweetWithUserName } from '../../../types/tweet.d';
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
    const [replies, setReplies] = useState<TweetWithUserName[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasReplies, setHasReplies] = useState(false);
    const [replyButtonClicked, setReplyButtonClicked] = useState(false);
    const [tweetPicture, setTweetPicture] = useState<Blob | null>(null);
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editReplyId, setEditReplyId] = useState<string | null>(null);
    const [editReplyText, setEditReplyText] = useState<string>('');
    const [originalTweet, setOriginalTweet] = useState<TweetWithUserName | null>(null);

    const checkReplies = useCallback(async () => {
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
                setReplyButtonClicked(false);
                setReplies([]);
            }
        } catch (error) {
            setHasReplies(false);
            setReplyButtonClicked(false);
            setReplies([]);
            console.error(`Failed to check replies for tweetId: ${tweet.tweet_id}`, error);
        }
    }, [tweet.tweet_id]);

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
    }, [editReplyId, handleDelete, handleSaveClick]);

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
                    <ProfileHeader userId={tweet.user_id} userName={tweet.user_name} />
                    <TweetContent text={tweet.tweet_text} createdAt={tweet.created_at} picture={tweetPicture} loadingPicture={loadingPicture} />
                    {originalTweet && (
                        <Box mt={2} p={2} style={{ backgroundColor: '#f0f0f0', borderRadius: '8px', width: '100%' }}>
                            <ProfileHeader userId={originalTweet.user_id} userName={originalTweet.user_name} />
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
                        />
                    )}
                </div>
            )}
        </ListItem>
    );
};

export default TweetItem;
