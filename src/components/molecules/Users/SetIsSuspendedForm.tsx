import React, { useState, useEffect } from 'react';
import { fetchUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { User } from '../../../types';
import { Box, Container, Typography, Switch, FormControlLabel } from '@mui/material';
import ConfirmationModal from '../../atoms/confirmation/ConfirmationModal';

const SetIsSuspendedForm: React.FC = () => {
    const { userId } = useUser();
    const [isSuspended, setIsSuspended] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user: User = await fetchUser(userId);
                setIsSuspended(user.is_suspended);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleToggleSuspend = () => {
        setModalOpen(true);
    };

    const handleConfirmToggle = async () => {
        try {
            const user: User = await fetchUser(userId);
            await updateUser(userId, user.user_name, user.user_description || '', user.is_private, !isSuspended);
            setSuccessMessage(`Inappropriate tweet is ${!isSuspended ? 'blocked' : 'unblocked'}`);
            setIsSuspended(!isSuspended);
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
                    Set Blocking Inappropriate Tweets
                </Typography>
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isSuspended}
                                onChange={handleToggleSuspend}
                                color="primary"
                            />
                        }
                        label={isSuspended ? 'Block' : 'Unblock'}
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
                description={`Are you sure you want to ${isSuspended ? 'block' : 'unblock'} inappropriate tweets?`}
            />
        </Container>
    );
};

export default SetIsSuspendedForm;
