import React, { useEffect, useState } from 'react';
import { List, ListItem } from '@mui/material';
import { getFollowers } from '../../../backend_routes/api/follower';
import { Follow } from '../../../types';
import { User } from '../../../types';
import { fetchUser } from '../../../backend_routes/api/users';
import { checkFollow } from '../../../backend_routes/api/follow';
import ProfileHeader from '../../atoms/Tweet/ProfileHeader';
import { useUser } from '../../../contexts/UserContext';

interface GetFollowsProps {
    userID: string;
}

const GetFollowers: React.FC<GetFollowsProps> = ({ userID }) => {
    const [followers, setFollowers] = useState<Follow[]>([]);
    const [user , setUser] = useState<User | null>(null);
    const [followOrNot, setFollowOrNot] = useState<boolean>(false);
    const { userId } = useUser();

    useEffect(() => {
        // Fetch the list of users that the given user is following
        const fetchFollowers = async () => {
            try {
                const response = await getFollowers(userID);
                setFollowers(response.follows);
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        fetchFollowers();
    }, [userID]);

    useEffect(() => {
        // Fetch the user data of the given user
        const fetchUserDetails = async () => {
            try {
                const user = await fetchUser(userId);
                setUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        // Check if the logged in user is following the given user
        const checkFollowStatus = async () => {
            try {
                const result = await checkFollow(userId, userID);
                setFollowOrNot(result);
            } catch (error) {
                console.error('Failed to check follow status:', error);
            }
        };

        checkFollowStatus();
    }, [userId, userID]);

    if (user?.is_private && !followOrNot && userId !== userID) {
        return <div>This account is private.</div>;
    }

    if (!followers || followers.length === 0) {
        return <div>No followers yet.</div>;
    }

    console.log(followers);

    return (
        <List>
            {followers.map((follower) => (
                <ListItem key={follower.user_id}>
                    <ProfileHeader userId={follower.user_id} />
                </ListItem>
            ))}
        </List>
    );
};

export default GetFollowers;