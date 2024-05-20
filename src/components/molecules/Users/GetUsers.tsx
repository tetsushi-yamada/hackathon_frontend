// src/components/TweetList.tsx
import React, { useState, useEffect } from 'react';
import { Users } from '../../../types/user.d'; 
import { searchUser } from '../../../backend_routes/api/users'; 
import FollowButton from '../FollowButton/FollowButton';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface UserListProps {
    searchWord: string;
}

const GetUserListComponent: React.FC = () => {
    const [searchWord, setSearchWord] = useState<string>('');
    const [fetchUsers, setFetchUsers] = useState<boolean>(false);

    const handleFetchUsers = () => {
        setFetchUsers(false);  
        setTimeout(() => {
            setFetchUsers(true); 
        }, 0);
    };

    return (
        <div>
            <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Search users..."
            />
            <Button onClick={handleFetchUsers}>Search Users</Button>
            {fetchUsers && <UserList searchWord={searchWord} />}
        </div>
    );
};

const UserList: React.FC<UserListProps> = ({ searchWord }) => {
    const [users, setUsers] = useState<Users>({ users: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await searchUser(searchWord);
                if (fetchedUsers.count === 0) {
                    setError('No users found');
                } else {
                    setError('');
                }
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (error) {
                setError('No Users Found');
                setLoading(false);
                console.error(error);
            }
        };
        fetchUsers();
    }, [searchWord]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Users</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {users.users.map((user) => (
                    <ListItem key={user.user_id} sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                        <ListItemText 
                            primary={`${user.user_name} @${user.user_id}`} 
                            sx={{ mr: 2, flex: '1 1 auto' }} 
                        />
                        <FollowButton user={user} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};
export default GetUserListComponent;
