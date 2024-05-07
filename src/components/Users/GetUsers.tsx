// src/components/TweetList.tsx
import React, { useState, useEffect } from 'react';
import { Users } from '../../types/user.d'; 
import { searchUser } from '../../backend_routes/api/users'; 

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
            <button onClick={handleFetchUsers}>Search Users</button>
            {fetchUsers && <UserList searchWord={searchWord} />}
        </div>
    );
};

const UserList: React.FC<UserListProps> = ({ searchWord }) => {
    const [users, setUsers] = useState<Users>({ users: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await searchUser(searchWord);
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (error) {
                setError('user not found');
                setLoading(false);
                console.error(error);
            }
        };
        fetchUsers();
    }, [searchWord]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.users.map(user => (
                    <li key={user.user_id}>{user.user_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default GetUserListComponent;
