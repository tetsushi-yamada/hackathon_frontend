import React, { useState, useEffect, FormEvent } from 'react';
import { fetchUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { User } from '../../../types';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const UpdateUserNameForm: React.FC = () => {
    const { userId } = useUser();
    const [userName, setUserName] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user: User = await fetchUser(userId);
                setUserName(user.user_name || '');
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const user: User = await fetchUser(userId);
            await updateUser(userId, userName, user.user_description, user.is_private);
            setSuccessMessage('User name updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user name:', error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Update User Name
                </Typography>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Update Name
                        </Button>
                    </form>
                ) : (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            {userName}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleEditClick}>
                            Edit Name
                        </Button>
                    </Box>
                )}
                {successMessage && (
                    <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                        {successMessage}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default UpdateUserNameForm;
