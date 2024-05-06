// src/components/SomeComponent.tsx
import React, { useState } from 'react';
import { createTweet } from '../../routes/api/tweets';
import { useTweet } from '../../contexts/TweetContext';

const PostTweet: React.FC<{ userId: string }> = ({ userId }) => {
    const [tweetText, setTweetText] = useState('');
    const { setTweetId } = useTweet();

    const handleTweetClick = async () => {
        try {
            const tweetId = await createTweet(userId, tweetText);
            setTweetId(tweetId);
            console.log('Created tweet ID:', tweetId);
        } catch (error) {
            setTweetId('');
            console.error('Failed to create tweet:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="Write a tweet..."
            />
            <button onClick={handleTweetClick}>Tweet</button>
        </div>
    );
};

export default PostTweet;
