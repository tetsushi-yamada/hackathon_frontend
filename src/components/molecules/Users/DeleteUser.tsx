import React from 'react';
import { useUser } from '../../../contexts/UserContext';
import { deleteUserDB } from '../../../backend_routes/api/users';
import { LogoutFunction } from '../Auth/LogoutForm';
import { deleteUserAuth } from '../Auth/DeleteUser';
import NormalButton from '../../atoms/Buttons/NormalButton';

interface DeleteUserProps {
    userId: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
    const { setUserId } = useUser();

    const handleUserClick = async () => {
        try {
            await deleteUserDB(userId);
            await setUserId('');
            await console.log('delete user ID:', userId);
            await LogoutFunction();
            await deleteUserAuth();
        } catch (error) {
            setUserId(userId);
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div>
            <NormalButton onClick={handleUserClick} color='red'>delete User</NormalButton>
        </div>
    );
};

export default DeleteUser;