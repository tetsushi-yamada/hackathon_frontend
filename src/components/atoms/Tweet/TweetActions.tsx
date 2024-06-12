import React from 'react';
import { IconButton, Button, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LikeButton from '../../atoms/Buttons/LikeButton';
import ReplyButton from '../../atoms/Buttons/ReplyButton';
import RetweetButton from '../../atoms/Buttons/RetweetButton';
import ConfirmationModal from '../confirmation/ConfirmationModal';

interface TweetActionsProps {
    tweetId: string;
    userId: string;
    hasReplies: boolean;
    loadingReplies: boolean;
    onReplySubmitted: () => void;
    onFetchReplies: () => void;
    onDelete: () => void;
    onEditClick: () => void;
    showRetweetButton: boolean;
}

const TweetActions: React.FC<TweetActionsProps> = ({
    tweetId,
    userId,
    hasReplies,
    loadingReplies,
    onReplySubmitted,
    onFetchReplies,
    onDelete,
    onEditClick,
    showRetweetButton
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    return (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <LikeButton tweetId={tweetId} userId={userId} />
            <ReplyButton tweetId={tweetId} userId={userId} onReplySubmitted={onReplySubmitted} />
            {showRetweetButton &&
                <RetweetButton tweetId={tweetId} userId={userId} onRetweetSubmitted={onReplySubmitted} />
            }
            <IconButton onClick={() => setModalOpen(true)}>
                <DeleteIcon />
            </IconButton>
            <ConfirmationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={onDelete}
                title="Confirm Delete Tweet"
                description="Are you sure you want to delete tweet?"
            />
            <IconButton onClick={onEditClick}>
                <EditIcon />
            </IconButton>
            {hasReplies && (
                <Button onClick={onFetchReplies} size="small">
                    {loadingReplies ? <CircularProgress size={24} /> : 'Show Replies'}
                </Button>
            )}
        </div>
    );
};

export default TweetActions;
