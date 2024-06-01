import React, {useState} from 'react';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../../components/molecules/Tweets/PostTweet';
import GetTweetListComponent from '../../components/molecules/Tweets/GetTweet';
import { Container, Box } from '@mui/material';

export const HomePageComponent: React.FC = () => {
    const { userId } = useUser(); // ユーザーIDを取得
    const [refreshTweets, setRefreshTweets] = useState(false);

    const handleTweetPosted = () => {
        setRefreshTweets((prev) => !prev); // 状態をトグルしてリフレッシュをトリガー
    };

    return (
        <Container maxWidth="md">
            <h1>Home Page</h1>
            <div>
                <GetTweetListComponent refresh={refreshTweets}/>
            </div>
            <Box position="fixed" bottom={16} right={16}>
                <PostTweet userId={userId} onTweetPosted={handleTweetPosted}/>
            </Box>
        </Container>
    );
};

export default HomePageComponent;