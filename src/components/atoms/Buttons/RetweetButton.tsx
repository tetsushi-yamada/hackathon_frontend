import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import RepeatIcon from '@mui/icons-material/Repeat';
import NormalInput from '../Inputs/NormalInput'; 
import NormalButton from './NormalButton';
import { createRetweet, getRetweets } from '../../../backend_routes/api/tweets'; // fetchRetweetsByTweetId関数をインポート

interface RetweetButtonProps {
    tweetId: string;
    userId: string;
    onRetweetSubmitted: () => void;
}

const RetweetButton: React.FC<RetweetButtonProps> = ({ tweetId, userId, onRetweetSubmitted }) => {
    const [retweetText, setRetweetText] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [retweetCount, setRetweetCount] = useState<number>(0);
    const [isRetweeted, setIsRetweeted] = useState<boolean>(() => {
        // コンポーネントのマウント時にローカルストレージから初期値を読み込む
        const storedIsRetweeted = localStorage.getItem(`isRetweeted_${tweetId}_${userId}`);
        return storedIsRetweeted !== null ? JSON.parse(storedIsRetweeted) : false;
    });

    useEffect(() => {
        const fetchRetweetCount = async () => {
            try {
                const retweets = await getRetweets(tweetId);
                const isCurrentlyRetweeted = retweets.tweets.some(retweet => retweet.user_id === userId);
                setIsRetweeted(isCurrentlyRetweeted);
                setRetweetCount(retweets.count);
                // 状態をローカルストレージに保存
                localStorage.setItem(`isRetweeted_${tweetId}_${userId}`, JSON.stringify(isCurrentlyRetweeted));
            } catch (error) {
                console.error('Failed to fetch retweet count:', error);
            }
        };

        fetchRetweetCount();
    }, [tweetId, userId]);

    const handleRetweetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRetweetText(event.target.value);
    };

    const handleRetweetSubmit = async () => {
        try {
            await createRetweet(userId, retweetText, tweetId);
            console.log(`Retweeting tweet ${tweetId} with message: ${retweetText}`);
            setRetweetText('');
            setShowInput(false);
            setRetweetCount(retweetCount + 1); // リツイート数をインクリメント
            setIsRetweeted(true); // リツイート状態を更新
            // 状態をローカルストレージに保存
            localStorage.setItem(`isRetweeted_${tweetId}_${userId}`, JSON.stringify(true));
            onRetweetSubmitted();
        } catch (error) {
            console.error('Failed to submit retweet:', error);
        }
    };

    return (
        <div style={{ display: 'inline-block' }}>
            <IconButton 
                onClick={() => setShowInput(!showInput)} 
                style={{ color: isRetweeted ? 'green' : 'default' }}
            >
                <RepeatIcon />
            </IconButton>
            <span>{retweetCount}</span> {/* リツイート数を表示 */}
            {showInput && (
                <div style={{ marginTop: '10px' }}>
                    <NormalInput
                        label="Retweet"
                        value={retweetText}
                        onChange={handleRetweetChange}
                    />
                    <NormalButton
                        variant="contained"
                        color="primary"
                        onClick={handleRetweetSubmit}
                    >
                        Send Retweet
                    </NormalButton>
                </div>
            )}
        </div>
    );
};

export default RetweetButton;
