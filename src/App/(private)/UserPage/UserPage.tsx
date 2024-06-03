import React from 'react';
import UserPageComponent from '../../../components/organisms/ProfilePage';
import { useUser } from '../../../contexts/UserContext';

const UserPage: React.FC = () => {
    const { userId } = useUser();
    return (
            <UserPageComponent userID={userId} />
    );
}

export default UserPage;