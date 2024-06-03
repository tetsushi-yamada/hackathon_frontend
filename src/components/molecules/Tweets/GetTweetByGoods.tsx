import TweetItem from "../../atoms/Tweet/TweetItem";
import { useState, useEffect } from "react";
import { TweetWithUserName } from "../../../types";
import { fetchGoodsByUserId } from "../../../backend_routes/api/goods";
import { fetchUser } from "../../../backend_routes/api/users";
import { getTweetsByTweetID, updateTweet, deleteTweet } from "../../../backend_routes/api/tweets";
import { List } from "@mui/material";

export const GetGoodsTweetListComponent: React.FC<{ userId: string, refresh: boolean }> = ({ userId, refresh }) => {
    const [tweets, setTweets] = useState<TweetWithUserName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editTweetId, setEditTweetId] = useState<string | null>(null);
    const [editTweetText, setEditTweetText] = useState<string>('');

    useEffect(() => {
        const fetchTweetsAndUser = async () => {
            try {
                const tweetsWithUserName: TweetWithUserName[] = [];
                const goods = await fetchGoodsByUserId(userId);
                for (const good of goods.goods) {
                    const user = await fetchUser(good.user_id);
                    const tweet = await getTweetsByTweetID(good.tweet_id);
                    const tweetWithUserName = { ...tweet, user_name: user.user_name };
                    tweetsWithUserName.push(tweetWithUserName);
                }
                tweetsWithUserName.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setTweets(tweetsWithUserName);
                setLoading(false);
            } catch (error) {
                setError('No Goods to Tweets');
                setLoading(false);
            }
        };
        fetchTweetsAndUser();
    }, [userId,refresh]);

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

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
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
        </div>
    );
}