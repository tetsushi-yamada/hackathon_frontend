import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { deleteFollow, createFollow, checkFollow } from '../../../backend_routes/api/follow';
import { checkFollowRequest } from '../../../backend_routes/api/follow_request';
import { User } from '../../../types/user.d';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../confirmation/ConfirmationModal';
import { Button } from '@mui/material';

interface OtherUserPageProps {
    user: User;
}

const FollowButton: React.FC<OtherUserPageProps> = ({ user }) => {
    const { userId } = useUser();
    const [followOrNot, setFollowOrNot] = useState<boolean>(false);
    const [followedOrNot, setFollowedOrNot] = useState<boolean>(false);
    const [followRequestSent, setFollowRequestSent] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const checkFollowStatus = useCallback(async () => {
        try {
            if (userId) {
                const result = await checkFollow(userId, user.user_id);
                setFollowOrNot(result);

                if (user.is_private) {
                    const requestResult = await checkFollowRequest(userId, user.user_id);
                    setFollowRequestSent(requestResult);
                } else {
                    setFollowRequestSent(false); // 鍵垢でない場合、フォローリクエスト状態をリセット
                }

                const followedResult = await checkFollow(user.user_id, userId);
                setFollowedOrNot(followedResult);
            }
        } catch (error) {
            console.error('failed to check Follow Status', error);
        }
    }, [userId, user.user_id, user.is_private]);

    const handleFollow = async (): Promise<void> => {
        try {
            if (userId !== user.user_id) {
                if (followOrNot) {
                    await deleteFollow(userId, user.user_id);
                } else {
                    if (user.is_private) {
                        setModalOpen(true);
                    } else {
                        await createFollow(userId, user.user_id);
                    }
                }
                await checkFollowStatus();
            } else {
                navigate(`/userpage/settings/profile`);
            }
        } catch (error) {
            console.error('Failed to handle follow', error);
        }
    };

    const handleConfirmFollowRequest = async () => {
        try {
            await createFollow(userId, user.user_id);
            setModalOpen(false);
            await checkFollowStatus(); // ステータスを確認
        } catch (error) {
            console.error('failed to send follow request', error);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        checkFollowStatus(); // ステータスを再度確認してリクエストが送信されていない状態に戻す
    };

    useEffect(() => {
        checkFollowStatus();
    }, [checkFollowStatus]);

    const buttonText = userId === user.user_id ? 'Profile Settings' : followOrNot ? 'UnFollow' : followRequestSent ? 'Already Requested' : followedOrNot ? 'FollowBack' : 'Follow';
    const buttonColor = userId === user.user_id ? 'primary' : followOrNot ? 'secondary' : followRequestSent ? 'default' : 'primary';

    return (
        <>
            <Button
                onClick={handleFollow}
                color={buttonColor === 'default' ? 'inherit' : buttonColor}
                variant="contained"
                sx={{
                    bgcolor: buttonColor === 'primary' ? 'primary.main' :
                            buttonColor === 'secondary' ? 'secondary.main' :
                            buttonColor === 'default' ? 'grey.500' : 'primary.main',
                    '&:hover': {
                        bgcolor: buttonColor === 'primary' ? 'primary.dark' :
                                buttonColor === 'secondary' ? 'secondary.dark' :
                                buttonColor === 'default' ? 'grey.700' : 'primary.dark',
                    }
                }}
            >
                {buttonText}
            </Button>
            <ConfirmationModal
                open={modalOpen}
                onClose={handleModalClose}
                onConfirm={handleConfirmFollowRequest}
                title="Send Follow Request?"
                description="This account is private. Do you want to send a follow request?"
            />
        </>
    );
};

export default FollowButton;
