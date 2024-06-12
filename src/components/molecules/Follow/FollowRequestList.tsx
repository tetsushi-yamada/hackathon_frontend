import React, { useState, useEffect } from 'react';
import { getFollowRequests, updateFollowRequest } from '../../../backend_routes/api/follow_request';
import { fetchUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { FollowRequest, FollowRequests, FollowRequestWithUserNameAndPicture } from '../../../types/follow_request.d';
import { fetchProfilePictureByUserId } from '../../../backend_routes/api/profile_picture';
import { Button, List, ListItem, Typography, Avatar, CircularProgress } from '@mui/material';

const FollowRequestsList: React.FC = () => {
    const { userId } = useUser();
    const [followRequests, setFollowRequests] = useState<FollowRequestWithUserNameAndPicture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowRequests = async () => {
            try {
                const requests: FollowRequests = await getFollowRequests(userId);
                const requestsWithUserData: FollowRequestWithUserNameAndPicture[] = await Promise.all(requests.follow_requests.map(async (request) => {
                    const user = await fetchUser(request.user_id);
                    let picture_url = "";
                    try {
                        const profilePicture = await fetchProfilePictureByUserId(request.user_id);
                        picture_url = URL.createObjectURL(profilePicture);
                    } catch (error) {
                        picture_url = "";
                    }
                    return {
                        ...request,
                        user_name: user.user_name,
                        profile_picture: picture_url,
                    };
                }));
                setFollowRequests(requestsWithUserData);
            } catch (error) {
                console.error("Error fetching follow requests:", error);
                setError("No follow requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowRequests();
    }, [userId]);

    const handleRequestUpdate = async (request: FollowRequest, status: string) => {
        try {
            await updateFollowRequest(request.user_id, request.follow_id, status);
            setFollowRequests(prevRequests => prevRequests.filter(r => r.user_id !== request.user_id || r.follow_id !== request.follow_id));
        } catch (error) {
            console.error("Error updating follow request:", error);
            setError("Failed to update follow request.");
        }
    };

    if (loading) return <CircularProgress />;

    if (error) return <Typography>{error}</Typography>;

    return (
        <List>
            {followRequests.map((request) => (
                <ListItem key={request.user_id} alignItems="flex-start">
                    <Avatar src={request.profile_picture} alt={request.user_name} />
                    <div style={{ marginLeft: 16 }}>
                        <Typography variant="body1">{request.user_name}</Typography>
                        <Typography variant="body2" color="textSecondary">{request.created_at}</Typography>
                        <div style={{ marginTop: 8 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleRequestUpdate(request, "approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleRequestUpdate(request, "rejected")}
                                style={{ marginLeft: 8 }}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </ListItem>
            ))}
        </List>
    );
};

export default FollowRequestsList;
