import React, { useState, useEffect } from 'react';
import { fetchUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { User } from '../../../types';
import { Box, Container, Typography, Switch, FormControlLabel } from '@mui/material';
import ConfirmationModal from '../../atoms/confirmation/ConfirmationModal';

const SetIsPrivateForm: React.FC = () => {
    const { userId } = useUser();
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user: User = await fetchUser(userId);
                setIsPrivate(user.is_private);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleTogglePrivate = () => {
        setModalOpen(true);
    };

    const handleConfirmToggle = async () => {
        try {
            const user: User = await fetchUser(userId);
            await updateUser(userId, user.user_name, user.user_description || '', !isPrivate, user.is_suspended);
            setSuccessMessage(`Account is now ${!isPrivate ? 'private' : 'public'}`);
            setIsPrivate(!isPrivate);
            setModalOpen(false);
        } catch (error) {
            console.error('Error updating user privacy:', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Set Account Privacy
                </Typography>
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrivate}
                                onChange={handleTogglePrivate}
                                color="primary"
                            />
                        }
                        label={isPrivate ? 'Private Account' : 'Public Account'}
                    />
                </Box>
                {successMessage && (
                    <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                        {successMessage}
                    </Typography>
                )}
            </Box>
            <ConfirmationModal
                open={modalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmToggle}
                title="Confirm Change"
                description={`Are you sure you want to switch your account to ${isPrivate ? 'public' : 'private'}?`}
            />
        </Container>
    );
};

export default SetIsPrivateForm;
