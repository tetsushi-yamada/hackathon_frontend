import React, { useState, useEffect } from 'react';
import { Users } from '../../../types/user.d'; 
import { searchUser } from '../../../backend_routes/api/users'; 
import FollowButton from '../../atoms/Buttons/FollowButton';
import ProfilePicture from './ProfilePictureGet';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Typography,Grid } from '@mui/material';

interface SearchProps {
    searchWord: string;
}


export const SearchUserList: React.FC<SearchProps> = ({ searchWord }) => {
    const [users, setUsers] = useState<Users>({ users: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await searchUser(searchWord);
                if (fetchedUsers.count === 0) {
                    setError('No Users Found');
                }
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch users');
                setLoading(false);
                console.error(error);
            }
        };
        fetchUsers();
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Users</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {users.count > 0 &&
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {users.users.map((user) => (
                        <ListItem key={user.user_id} sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                            <Link to={`/userpage/${user.user_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <ProfilePicture user_id={user.user_id} radius={20} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="body1" fontWeight="bold">
                                            {user.user_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            @{user.user_id}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Link>
                            <FollowButton user={user} />
                        </ListItem>
                    ))}
                </List>
            }
        </div>
    );
};
