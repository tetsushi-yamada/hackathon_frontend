import React, { useState, useEffect } from 'react';
import { Tweet } from '../../../types/tweet.d'; 
import { getTweetsByUserID } from '../../../backend_routes/api/tweets'; 
import { useFollow } from '../../../contexts/FollowsContext';
import { fetchUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { updateTweet } from '../../../backend_routes/api/tweets';
import NormalButton from '../../atoms/Buttons/NormalButton';
import NormalInput from '../../atoms/Inputs/NormalInput';
import { List, ListItem } from '@mui/material';
import LikeButton from '../../atoms/Buttons/LikeButton';

interface TweetWithUserName extends Tweet {
    user_name: string;
}

export const MyTweetList: React.FC = () => {
    const { userId } = useUser()
    const [tweets, setTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editTweetId, setEditTweetId] = useState<string | null>(null);
    const [editTweetText, setEditTweetText] = useState<string>('');

    useEffect(() => {
        const fetchTweetsAndUser = async () => {
            try {
                const fetchedTweets = await getTweetsByUserID(userId);
                const user = await fetchUser(userId);
                const tweetsWithUserName = fetchedTweets.tweets.map(tweet => ({
                    ...tweet,
                    user_name: user.user_name,
                }));
                tweetsWithUserName.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setTweets(tweetsWithUserName);
                setLoading(false);
            } catch (error) {
                setError('No Tweets');
                setLoading(false);
            }
        };
        fetchTweetsAndUser();
    }, [userId]);

    const handleEditClick = (tweet_id: string, tweet_text: string) => {
        setEditTweetId(tweet_id);
        setEditTweetText(tweet_text);
    };

    const handleSaveClick = async () => {
        if (editTweetId) {
            try {
                await updateTweet(editTweetId, editTweetText);
                setTweets(prevTweets => prevTweets.map(tweet =>
                    tweet.tweet_id === editTweetId ? { ...tweet, tweet_text: editTweetText } : tweet
                ));
                setEditTweetId(null);
                setEditTweetText('');
            } catch (error) {
                setError('Error updating tweet');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <List>
            {tweets.map(tweet => (
                <ListItem key={tweet.tweet_id}>
                    {editTweetId === tweet.tweet_id ? (
                        <div>
                            <NormalInput
                                label="Edit Tweet"
                                value={editTweetText}
                                onChange={e => setEditTweetText(e.target.value)}
                            />
                            <NormalButton onClick={handleSaveClick}>Save</NormalButton>
                        </div>
                    ) : (
                        <div>
                            <strong>{tweet.user_name}</strong>: {tweet.tweet_text} ({new Date(tweet.created_at).toLocaleString()})
                            <NormalButton onClick={() => handleEditClick(tweet.tweet_id, tweet.tweet_text)}>Edit</NormalButton>
                        </div>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export const TweetList: React.FC<{ userId: string }> = ({ userId }) => {
    const [tweets, setTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTweetsAndUser = async () => {
            try {
                const fetchedTweets = await getTweetsByUserID(userId);
                const user = await fetchUser(userId);
                const tweetsWithUserName = fetchedTweets.tweets.map(tweet => ({
                    ...tweet,
                    user_name: user.user_name,
                }));
                setTweets(tweetsWithUserName);
                setLoading(false);
            } catch (error) {
                setError('No Tweets');
                setLoading(false);
            }
        };
        fetchTweetsAndUser();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <ul>
            {tweets.map(tweet => (
                <li key={tweet.tweet_id}>
                    <strong>{tweet.user_name}</strong>: {tweet.tweet_text} ({new Date(tweet.created_at).toLocaleString()})
                </li>
            ))}
        </ul>
    );
};

const GetTweetListComponent: React.FC = () => {
    const { followStatus } = useFollow();
    const followedUsers = Object.keys(followStatus).filter(userId => followStatus[userId]);
    const [allTweets, setAllTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useUser();

    useEffect(() => {
        const fetchAllTweets = async () => {
            try {
                const allFetchedTweets: TweetWithUserName[] = [];
                for (const follow_userId of followedUsers) {
                    const fetchedTweets = await getTweetsByUserID(follow_userId);
                    const user = await fetchUser(follow_userId);
                    const tweetsWithUserName = fetchedTweets.tweets.map(tweet => ({
                        ...tweet,
                        user_name: user.user_name,
                    }));
                    allFetchedTweets.push(...tweetsWithUserName);
                }
                allFetchedTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setAllTweets(allFetchedTweets);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch tweets or users');
                setLoading(false);
                console.error(error);
            }
        };

        if (followedUsers.length > 0) {
            fetchAllTweets();
        } else {
            setLoading(false);
        }
    }, [followedUsers]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {allTweets.length === 0 ? (
                <div>No tweets from followed users.</div>
            ) : (
                <ul>
                    {allTweets.map(tweet => (
                        <li key={tweet.tweet_id}>
                            <strong>{tweet.user_name}</strong>: {tweet.tweet_text} ({new Date(tweet.created_at).toLocaleString()})
                            <LikeButton tweetId={tweet.tweet_id} userId={userId} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GetTweetListComponent;
