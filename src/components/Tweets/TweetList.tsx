// src/components/TweetList.tsx
import React, { useState, useEffect } from 'react';
import { Tweets } from '../../types/tweet.d'; 
import { getTweetsByUserID } from '../../routes/api/tweets'; 

interface TweetListProps {
    userId: string;
}

const GetTweetListComponent: React.FC<TweetListProps> = ({ userId }) => {
    const [fetchTweets, setFetchTweets] = useState<boolean>(false);

    const handleFetchTweets = () => {
        setFetchTweets(false);  
        setTimeout(() => {
            setFetchTweets(true); 
        }, 0);
    };

    return (
        <div>
            <button onClick={handleFetchTweets}>Fetch Tweets</button>
            {fetchTweets && userId && <TweetList userId={userId} />}
        </div>
    );
};

const TweetList: React.FC<TweetListProps> = ({ userId }) => {
    const [tweets, setTweets] = useState<Tweets>({ tweets: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const fetchedTweets = await getTweetsByUserID(userId);
                setTweets(fetchedTweets);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch tweets');
                setLoading(false);
                console.error(error);
            }
        };

        fetchTweets();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Tweets</h2>
            <ul>
                {tweets.tweets.map(tweet => (
                    <li key={tweet.tweet_id}>{tweet.tweet_text}</li>
                ))}
            </ul>
        </div>
    );
};

export default GetTweetListComponent;
