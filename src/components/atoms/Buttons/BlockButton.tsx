import React from 'react';
import BlockIcon from '@mui/icons-material/Block';
import { IconButton } from '@mui/material';
import { createBlock, checkBlock, deleteBlock } from '../../../backend_routes/api/block';
import { useUser } from '../../../contexts/UserContext';
import ConfirmationModal from '../confirmation/ConfirmationModal';

const BlockButton: React.FC<{ userID: string }> = ({ userID }) => {
    const { userId } = useUser();
    const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);

    const checkIfBlocked = async () => {
        try {
            const result = await checkBlock(userId, userID);
            setIsBlocked(result);
        } catch (error) {
            console.error('Failed to check block status:', error);
        }
    };

    React.useEffect(() => {
        checkIfBlocked();
    }); // isBlockedを依存配列に追加

    const handleBlockToggle = async () => {
        try {
            if (isBlocked) {
                await deleteBlock(userId, userID);
            } else {
                await createBlock(userId, userID);
            }
            setIsBlocked(!isBlocked);
            setModalOpen(false); // モーダルを閉じる
        } catch (error) {
            console.error('Error toggling block:', error);
        }
    };

    const handleIconClick = () => {
        setModalOpen(true); // モーダルを開く
    };

    const handleModalClose = () => {
        setModalOpen(false); // モーダルを閉じる
    };

    return (
        <>
            <IconButton onClick={handleIconClick} color={isBlocked ? 'secondary' : 'default'}>
                <BlockIcon />
            </IconButton>
            <ConfirmationModal
                open={modalOpen}
                onClose={handleModalClose}
                onConfirm={handleBlockToggle}
                title={isBlocked ? "Unblock User?" : "Block User?"}
                description={isBlocked ? "Are you sure you want to unblock this user?" : "Are you sure you want to block this user?"}
            />
        </>
    );
};

export default BlockButton;
