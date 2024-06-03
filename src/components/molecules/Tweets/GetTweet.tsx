import React, { useState, useEffect } from 'react';
import { getTweetsByUserID } from '../../../backend_routes/api/tweets';
import { fetchUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { List } from '@mui/material';
import { TweetWithUserName } from '../../../types/tweet.d';
import TweetItem from '../../atoms/Tweet/TweetItem';
import { updateTweet } from '../../../backend_routes/api/tweets';
import { deleteTweet } from '../../../backend_routes/api/tweets';
import { getFollows } from '../../../backend_routes/api/follow';

const GetTweetListComponent: React.FC<{ refresh: boolean }> = ({ refresh }) => {
    const [allTweets, setAllTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useUser();
    const [editTweetId, setEditTweetId] = useState<string | null>(null);
    const [editTweetText, setEditTweetText] = useState<string>('');

    useEffect(() => {
        const fetchAllTweets = async () => {
            try {
                const allFetchedTweets: TweetWithUserName[] = [];

                // 自分のツイートを取得
                try {
                    const myTweets = await getTweetsByUserID(userId);
                    const myUser = await fetchUser(userId);
                    const myTweetsWithUserName: TweetWithUserName[] = [];
                    for (const tweet of myTweets.tweets) {
                        if (tweet.parent_id == null) {
                            myTweetsWithUserName.push({ ...tweet, user_name: myUser.user_name });
                        }
                    }
                    allFetchedTweets.push(...myTweetsWithUserName);
                } catch (error) {
                    console.error(`Failed to fetch tweets or user for userId: ${userId}`, error);
                }

                // フォローしているユーザーのツイートを取得
                try {
                    const followsResult = await getFollows(userId);
                    if (followsResult && followsResult.follows) {
                        for (const follow of followsResult.follows) {
                            const fetchedTweets = await getTweetsByUserID(follow.follow_id);
                            const user = await fetchUser(follow.follow_id);
                            const tweetsWithUserName: TweetWithUserName[] = [];
                            for (const tweet of fetchedTweets.tweets) {
                                if (tweet.parent_id == null) {
                                    tweetsWithUserName.push({ ...tweet, user_name: user.user_name });
                                }
                            }
                            allFetchedTweets.push(...tweetsWithUserName);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to fetch tweets or user for follow_userId: `, error);
                }

                // ツイートを日付順にソート
                allFetchedTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setAllTweets(allFetchedTweets);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch tweets or users');
                setLoading(false);
                console.error('General error fetching tweets or users', error);
            }
        };

        if (userId) {
            fetchAllTweets();
        } else {
            setLoading(false);
        }
    }, [userId, refresh]);

    const handleEditClick = (tweet_id: string, tweet_text: string) => {
        setEditTweetId(tweet_id);
        setEditTweetText(tweet_text);
    };

    const handleSaveClick = async () => {
        if (editTweetId) {
            try {
                await updateTweet(editTweetId, editTweetText);
                setAllTweets(prevTweets => prevTweets.map(tweet =>
                    tweet.tweet_id === editTweetId ? { ...tweet, tweet_text: editTweetText } : tweet
                ));
                setEditTweetId(null);
                setEditTweetText('');
            } catch (error) {
                setError('Error updating tweet');
            }
        }
    };

    const handleDelete = async (tweet_id: string) => {
        try {
            await deleteTweet(tweet_id);
            setAllTweets(prevTweets => prevTweets.filter(tweet => tweet.tweet_id !== tweet_id));
        } catch (error) {
            setError('Error deleting tweet');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {allTweets.length === 0 ? (
                <div>No tweets</div>
            ) : (
                <List>
                    {allTweets.map(tweet => (
                        <TweetItem
                            key={tweet.tweet_id}
                            tweet={tweet}
                            editTweetId={editTweetId}
                            editTweetText={editTweetText}
                            setEditTweetText={setEditTweetText}
                            handleEditClick={handleEditClick}
                            handleSaveClick={handleSaveClick}
                            handleDelete={handleDelete}
                        />
                    ))}
                </List>
            )}
        </div>
    );
};

export default GetTweetListComponent;
