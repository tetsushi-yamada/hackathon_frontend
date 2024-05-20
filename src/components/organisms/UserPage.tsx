import React from 'react';
import { MyTweetList } from '../../components/molecules/Tweets/GetTweet';
import { Link } from 'react-router-dom';
import NormalButton from '../atoms/Buttons/NormalButton';

const UserPageComponent: React.FC = () => { 
    return (
        <div>
            <h1>User Page</h1>
            <MyTweetList />
            <Link to="/settings">
                <NormalButton>Go to Settings</NormalButton>
            </Link>
        </div>
    );
}

export default UserPageComponent;