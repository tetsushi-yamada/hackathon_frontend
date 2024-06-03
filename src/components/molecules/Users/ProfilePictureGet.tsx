import React, { useEffect, useState } from 'react';
import { fetchProfilePictureByUserId } from '../../../backend_routes/api/profile_picture';
import { Avatar, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface ProfilePictureProps {
    user_id: string;
    radius: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user_id, radius }) => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const blob = await fetchProfilePictureByUserId(user_id);
                const url = URL.createObjectURL(blob);
                setProfilePicture(url);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture();
    }, [user_id]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            {profilePicture ? (
                <Avatar
                    src={profilePicture}
                    alt="Profile"
                    sx={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                    }}
                />
            ) : (
                <Avatar
                    sx={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                    }}
                >
                    <AccountCircleIcon sx={{ width: `${radius}px`, height: `${radius}px` }} />
                </Avatar>
            )}
        </Box>
    );
};

export default ProfilePicture;
