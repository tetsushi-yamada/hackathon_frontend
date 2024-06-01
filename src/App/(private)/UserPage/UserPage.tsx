import React from 'react';
import UserPageComponent from '../../../components/organisms/ProfilePage';
import { useUser } from '../../../contexts/UserContext';

const UserPage: React.FC = () => {
    const { userId } = useUser();
    return (
        <div>
            <UserPageComponent userID={userId} />
        </div>
    );
}

export default UserPage;