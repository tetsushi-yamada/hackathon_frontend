import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ProfilePicture from '../../molecules/Users/ProfilePictureGet';
import { fetchUser } from '../../../backend_routes/api/users';
import { User } from '../../../types/user.d';
import LockIcon from '@mui/icons-material/Lock';

interface ProfileHeaderProps {
    userId: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await fetchUser(userId);
            setUser(user);
        };
        getUser();
    }, [userId]);

    return (
        <Link to={`/userpage/${userId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
            <Box mb={2}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <ProfilePicture user_id={userId} radius={20} />
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" fontWeight="bold">
                                {user?.user_name}
                            </Typography>
                            {user?.is_private && <LockIcon style={{ marginLeft: 4 }} />}
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                            @{user?.user_id}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Link>
    );
};

export default ProfileHeader;
