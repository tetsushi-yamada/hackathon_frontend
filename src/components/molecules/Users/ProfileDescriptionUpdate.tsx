import React, { useState, useEffect, FormEvent } from 'react';
import { fetchUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { User } from '../../../types';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const UpdateUserDescriptionForm: React.FC = () => {
    const { userId } = useUser();
    const [description, setDescription] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user: User = await fetchUser(userId);
                setDescription(user.user_description || '');
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
            await updateUser(userId, user.user_name, description, user.is_private, user.is_suspended);
            setSuccessMessage('User description updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user description:', error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Update User Description
                </Typography>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="User Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Update Description
                        </Button>
                    </form>
                ) : (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            {description}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleEditClick}>
                            Edit Description
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

export default UpdateUserDescriptionForm;
