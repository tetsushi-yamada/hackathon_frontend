import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ReplyIcon from '@mui/icons-material/Reply';
import NormalInput from '../Inputs/NormalInput'; 
import NormalButton from './NormalButton';
import { createReplyTweet } from '../../../backend_routes/api/tweets';
import { checkTweetForInappropriateness } from '../../../backend_routes/api/openapi';

interface ReplyButtonProps {
    tweetId: string;
    userId: string;
    onReplySubmitted: () => void;
}

const ReplyButton: React.FC<ReplyButtonProps> = ({ tweetId, userId, onReplySubmitted }) => {
    const [reply, setReply] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReply(event.target.value);
    };

    const handleReplySubmit = async () => {
        try {
            const inappropriate = await checkTweetForInappropriateness(reply);
            await createReplyTweet(userId, reply, tweetId, inappropriate)
            console.log(`Replying to tweet ${tweetId} with message: ${reply}`);
            setReply('');
            setShowInput(false);
            onReplySubmitted();
        } catch (error) {
            console.error('Failed to submit reply:', error);
        }
    };

    return (
        <div>
            <IconButton onClick={() => setShowInput(!showInput)}>
                <ReplyIcon />
            </IconButton>
            {showInput && (
                <div style={{ marginTop: '10px' }}>
                    <NormalInput
                        label="Reply"
                        value={reply}
                        onChange={handleReplyChange}
                    />
                    <NormalButton
                        variant="contained"
                        color="primary"
                        onClick={handleReplySubmit}
                    >
                        Send Reply
                    </NormalButton>
                </div>
            )}
        </div>
    );
};

export default ReplyButton;
