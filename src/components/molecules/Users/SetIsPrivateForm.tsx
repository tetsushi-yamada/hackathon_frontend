import React, { useState, useEffect } from 'react';
import { fetchUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { User } from '../../../types';
import { Box, Container, Typography, Switch, FormControlLabel } from '@mui/material';
import ConfirmationModal from '../../atoms/confirmation/ConfirmationModal';

const SetIsPrivateForm: React.FC = () => {
    const { userId } = useUser();
    const [user, setUser] = useState<User | null>(null);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchedUser: User = await fetchUser(userId);
                setUser(fetchedUser);
                setIsPrivate(fetchedUser.is_private);
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
        if (user) {
            try {
                await updateUser(userId, user.user_name, user.age, user.user_description || '', !isPrivate, user.is_suspended);
                setSuccessMessage(`Account is now ${!isPrivate ? 'private' : 'public'}`);
                setIsPrivate(!isPrivate);
                setModalOpen(false);
            } catch (error) {
                console.error('Error updating user privacy:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Set Account Privacy
                </Typography>
                {user.age < 18 ? (
                    <Typography variant="body1" color="error.main" sx={{ mt: 2 }}>
                        You are under 18 years old. Your account is automatically set to private.
                    </Typography>
                ) : (
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
                )}
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
