import React, { useEffect, useState } from 'react';

interface Tweet {
    user: string;
    message: string;
}

const TweetList: React.FC = () => {
    const [tweets, setTweets] = useState<Tweet[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onmessage = (event) => {
            const tweet: Tweet = JSON.parse(event.data);
            setTweets((prevTweets) => [...prevTweets, tweet]);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            {tweets.map((tweet, index) => (
                <div key={index}>
                    <h4>{tweet.user}</h4>
                    <p>{tweet.message}</p>
                </div>
            ))}
        </div>
    );
};

export default TweetList;
