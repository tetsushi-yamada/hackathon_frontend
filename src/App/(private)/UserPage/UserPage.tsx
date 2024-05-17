import React from 'react';
import LogoutForm from "../../../components/molecules/Auth/LogoutForm";
import DeleteUser from '../../../components/molecules/Users/DeleteUser';
import { useUser } from '../../../contexts/UserContext';
import { MyTweetList } from '../../../components/molecules/Tweets/GetTweet';

const UserPageComponent: React.FC = () => {
    const { userId } = useUser(); 

    return (
        <div>
            <h1>User Page</h1>
            <MyTweetList />
            <DeleteUser userId={userId}/>
            <LogoutForm />
        </div>
    );
}

export default UserPageComponent;