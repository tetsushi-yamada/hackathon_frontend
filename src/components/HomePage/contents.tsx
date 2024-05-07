import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getTweetsByUserID, deleteTweet } from '../../backend_routes/api/tweets';
import { getFollows, createFollow, deleteFollow } from '../../backend_routes/api/follow';
import { getFollowers } from '../../backend_routes/api/follower';
import PostTweet from '../Tweets/PostTweet';
import GetTweetListComponent from '../Tweets/GetTweet';

export const HomePage: React.FC = () => {
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
                <GetTweetListComponent userId={userId}/>
            </div>
            <div>
                <h2>Follow Management</h2>
                <button onClick={() => createFollow(userId, "AnotherUserID")}>Follow User</button>
                <button onClick={() => deleteFollow(userId, "AnotherUserID")}>Unfollow User</button>
                <button onClick={() => getFollows(userId)}>Get Follows</button>
                <button onClick={() => getFollowers(userId)}>Get Followers</button>
            </div>
        </div>
    );
};

export default HomePage;
