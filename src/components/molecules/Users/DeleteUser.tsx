import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { deleteUserDB } from '../../../backend_routes/api/users';
import { LogoutFunction } from '../Auth/LogoutForm';
import { deleteUserAuth } from '../Auth/DeleteUser';
import NormalButton from '../../atoms/Buttons/NormalButton';
import ConfirmationModal from '../../atoms/confirmation/ConfirmationModal';

interface DeleteUserProps {
    userId: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
    const { setUserId } = useUser();
    const [modalOpen, setModalOpen] = useState(false);

    const handleUserClick = async () => {
        try {
            await deleteUserDB(userId);
            await setUserId('');
            console.log('Deleted user ID:', userId);
            await LogoutFunction();
            await deleteUserAuth();
        } catch (error) {
            setUserId(userId);
            console.error('Failed to delete user:', error);
        }
    };

    const handleConfirm = () => {
        setModalOpen(false);
        handleUserClick();
    };

    return (
        <div>
            <NormalButton onClick={() => setModalOpen(true)} color="red">
                Delete User
            </NormalButton>
            <ConfirmationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                title="Confirm Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
            />
        </div>
    );
};

export default DeleteUser;
