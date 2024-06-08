import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ProfilePicture from '../../molecules/Users/ProfilePictureGet';

interface ProfileHeaderProps {
    userId: string;
    userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId, userName }) => {
    return (
        <Link to={`/userpage/${userId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
            <Box mb={2}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <ProfilePicture user_id={userId} radius={20} />
                    </Grid>
                    <Grid item xs>
                        <Typography variant="body1" fontWeight="bold">
                            {userName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            @{userId}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Link>
    );
};

export default ProfileHeader;
