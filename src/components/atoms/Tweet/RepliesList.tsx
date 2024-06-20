import React from 'react';
import { List, ListItem, Typography, Box, IconButton } from '@mui/material';
import { TweetWithUserName } from '../../../types/tweet.d';
import LikeButton from '../../atoms/Buttons/LikeButton';
import ConfirmationModal from '../confirmation/ConfirmationModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NormalInput from '../Inputs/NormalInput';
import NormalButton from '../Buttons/NormalButton';
import ProfileHeader from './ProfileHeader';
import { User } from '../../../types';

interface RepliesListProps {
    replies: TweetWithUserName[];
    editReplyId: string | null;
    editReplyText: string;
    setEditReplyText: (text: string) => void;
    handleReplyEditClick: (tweet_id: string, tweet_text: string) => void;
    handleReplySaveClick: () => void;
    handleDelete: (tweet_id: string) => void;
    hasReplies: boolean;
    setHasReplies: (hasReplies: boolean) => void;
    editingUser: User | null;
}

const RepliesList: React.FC<RepliesListProps> = ({
    replies,
    editReplyId,
    editReplyText,
    setEditReplyText,
    handleReplyEditClick,
    handleReplySaveClick,
    handleDelete,
    hasReplies,
    setHasReplies,
    editingUser
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    
    return (
        <List style={{ marginTop: '16px', width: '100%', backgroundColor: '#f9f9f9', padding: '8px' }}>
            {replies.map(reply => (
                <ListItem key={reply.tweet_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px', borderBottom: '1px solid #eee' }}>
                    {editReplyId === reply.tweet_id ? (
                        <div style={{ width: '100%' }}>
                            <NormalInput
                                label="Edit Reply"
                                value={editReplyText}
                                onChange={e => setEditReplyText(e.target.value)}
                            />
                            <NormalButton onClick={handleReplySaveClick} variant="contained" color="primary">
                                Save
                            </NormalButton>
                        </div>
                    ) : (
                        editingUser?.is_suspended && reply.is_inappropriate ? (
                            <div style={{ width: '100%' }}>
                                <Box mb={2}>
                                    <ProfileHeader userId={reply.user_id} />
                                    <div style={{width: '100%'}}>
                                        <div style={{padding: '16px', backgroundColor: '#ffcccc', borderRadius: '8px', width: '100%'}}>
                                            <p>このツイートは不適切な内容を含んでいる可能性があります。</p>
                                            <p>このツイートは非表示にされました。</p>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        ) : (
                            <div style={{ width: '100%' }}>
                                <Box mb={2}>
                                    <ProfileHeader userId={reply.user_id} />
                                    <Typography variant="body1" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                                        {reply.tweet_text}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px' }}>
                                        {new Date(reply.created_at).toLocaleString()}
                                    </Typography>
                                </Box>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                    <LikeButton tweetId={reply.tweet_id} userId={reply.user_id} />
                                    <IconButton onClick={() => setModalOpen(true)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <ConfirmationModal
                                        open={modalOpen}
                                        onClose={() => setModalOpen(false)}
                                        onConfirm={() => handleDelete(reply.tweet_id)}
                                        title="Confirm Delete Reply"
                                        description="Are you sure you want to delete reply?"
                                    />
                                    <IconButton onClick={() => handleReplyEditClick(reply.tweet_id, reply.tweet_text)}>
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </div>
                        )
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default RepliesList;
