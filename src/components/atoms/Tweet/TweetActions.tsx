import React from 'react';
import { IconButton, Button, CircularProgress, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LikeButton from '../../atoms/Buttons/LikeButton';
import ReplyButton from '../../atoms/Buttons/ReplyButton';
import RetweetButton from '../../atoms/Buttons/RetweetButton';
import ConfirmationModal from '../confirmation/ConfirmationModal';
import TranslateTweetButton from '../Buttons/TranslateTweetButon';

interface TweetActionsProps {
    tweetId: string;
    userId: string;
    hasReplies: boolean;
    loadingReplies: boolean;
    onReplySubmitted: () => void;
    onFetchReplies: () => void;
    onDelete: () => void;
    onEditClick: () => void;
    replyCount: number;
    setReplyCount: (count: number) => void;
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
    replyCount,
    setReplyCount,
    showRetweetButton
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    

    return (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <LikeButton tweetId={tweetId} userId={userId} />
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
            <TranslateTweetButton tweetId={tweetId} />
            <ReplyButton tweetId={tweetId} userId={userId} onReplySubmitted={onReplySubmitted} />
            {hasReplies && (
                <Box display="flex" alignItems="center">
                <Button onClick={onFetchReplies} size="small">
                    {loadingReplies ? <CircularProgress size={24} /> : 'Show Replies'}
                </Button>
                <Box 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        marginLeft: 1
                    }}
                >
                    <Typography variant="body2">
                        {replyCount}
                    </Typography>
                </Box>
            </Box>
            )}
        </div>
    );
};

export default TweetActions;
