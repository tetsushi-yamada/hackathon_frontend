// FollowButton.tsx
import React from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useFollow } from '../../../contexts/FollowsContext';
import { deleteFollow, createFollow } from '../../../backend_routes/api/follow';
import NormalButton from '../../atoms/Buttons/NormalButton';
import { User } from '../../../types/user.d';

interface OtherUserPageProps {
    user: User;
}

const FollowButton: React.FC<OtherUserPageProps> = ({ user }) => {
    const { followStatus, toggleFollow } = useFollow();
    const { userId } = useUser();

    const handleFollow = async (): Promise<void> => {
        try{if (userId === user.user_id) {;
            }else if (followStatus[user.user_id]) {
                await deleteFollow(userId, user.user_id);
                toggleFollow(user.user_id);
            }else {
                await createFollow(userId, user.user_id);
                toggleFollow(user.user_id);
            }
        }catch(error){
            console.error('フォロー操作に失敗しました', error);
        }
    };

    return (
        <NormalButton onClick={handleFollow}>
            {userId === user.user_id ? 'プロフィール設定' : (followStatus[user.user_id] ? 'フォロー解除' : 'フォローする')}
        </NormalButton>
    );
};

export default FollowButton;
