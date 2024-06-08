import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { deleteFollow, createFollow, checkFollow } from '../../../backend_routes/api/follow';
import NormalButton from './NormalButton';
import { User } from '../../../types/user.d';
import { useNavigate } from 'react-router-dom';

interface OtherUserPageProps {
    user: User;
}

const FollowButton: React.FC<OtherUserPageProps> = ({ user }) => {
    const { userId } = useUser();
    const [followOrNot, setFollowOrNot] = useState<boolean>(false);
    const navigate = useNavigate();

    const checkFollowStatus = async () => {
        if (userId) {
            const result = await checkFollow(userId, user.user_id);
            setFollowOrNot(result);
        }
    };

    useEffect(() => {
        checkFollowStatus();
    });

    const handleFollow = async (): Promise<void> => {
        try {
            if (userId !== user.user_id) {
                if (followOrNot) {
                    await deleteFollow(userId, user.user_id);
                } else {
                    await createFollow(userId, user.user_id);
                }
                await checkFollowStatus();  // フォロー状態を再確認
            } else {
                navigate(`/userpage/settings/profile`);
            }
        } catch (error) {
            console.error('フォロー操作に失敗しました', error);
        }
    };

    return (
        <NormalButton onClick={handleFollow}>
            {userId === user.user_id ? 'プロフィール設定' : (followOrNot ? 'フォロー解除' : 'フォローする')}
        </NormalButton>
    );
};

export default FollowButton;
