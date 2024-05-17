
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import PostTweet from '../../components/molecules/Tweets/PostTweet';
import GetTweetListComponent from '../../components/molecules/Tweets/GetTweet';

export const HomePageComponent: React.FC = () => {
    const { userId } = useUser(); // ユーザーIDを取得

    return (
        <div>
            <h1>Home Page</h1>
            <div>
                <h2>User Actions</h2>
            </div>
            <div>
                <h2>Tweets</h2>
                <PostTweet userId={userId} />
                <GetTweetListComponent />
            </div>
        </div>
    );
};

export default HomePageComponent;