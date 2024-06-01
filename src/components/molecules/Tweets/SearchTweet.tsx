import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import { TweetWithUserName } from '../../../types';
import { searchTweets } from '../../../backend_routes/api/tweets';
import { fetchUser } from '../../../backend_routes/api/users';
import TweetItem from '../../atoms/Tweet/TweetItem';
import { updateTweet } from '../../../backend_routes/api/tweets';
import { deleteTweet } from '../../../backend_routes/api/tweets';

interface SearchProps {
    searchWord: string;
}

export const SearchTweetList: React.FC<SearchProps> = ({ searchWord }) => {
    const [tweets, setTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editTweetId, setEditTweetId] = useState<string | null>(null);
    const [editTweetText, setEditTweetText] = useState<string>('');

    useEffect(() => {
        const fetchTweetsAndUser = async () => {
            try {
                const fetchedTweets = await searchTweets(searchWord);
                const tweetsWithUserName: TweetWithUserName[] = [];
                for (const tweet of fetchedTweets.tweets) {
                    const user = await fetchUser(tweet.user_id);
                    const tweetWithUserName = { ...tweet, user_name: user.user_name };
                    tweetsWithUserName.push(tweetWithUserName);
                }
                tweetsWithUserName.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setTweets(tweetsWithUserName);
                setLoading(false);
            } catch (error) {
                setError('No Tweets found');
                setLoading(false);
            }
        };
        fetchTweetsAndUser();
    }, [searchWord]);

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

    const handleDelete = async (tweet_id: string) => {
        try {
            await deleteTweet(tweet_id);
            setTweets(prevTweets => prevTweets.filter(tweet => tweet.tweet_id !== tweet_id));
        } catch (error) {
            setError('Error deleting tweet');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Tweets</h2>
            {tweets.length === 0 ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <List>
                    {tweets.map(tweet => (
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
}