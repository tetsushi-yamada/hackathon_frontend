import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { fetchUser, deleteUser } from '../../routes/api/users';
import { getTweetsByUserID, deleteTweet } from '../../routes/api/tweets';
import GetTweetListComponent from '../Tweets/TweetList';
import { getFollows, createFollow, deleteFollow } from '../../routes/api/follow';
import { getFollowers } from '../../routes/api/follower';
import PostTweet from '../Tweets/TweetTextComponent';

export const HomePage: React.FC = () => {
    const { userId } = useUser(); // ユーザーIDを取得

    return (
        <div>
            <h1>Home Page</h1>
            <div>
                <h2>User Actions</h2>
                <button onClick={() => fetchUser(userId)}>Fetch User</button>
                <button onClick={() => deleteUser(userId)}>Delete User</button>
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
