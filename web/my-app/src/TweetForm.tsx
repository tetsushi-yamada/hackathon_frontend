import React, { useState } from 'react';

const TweetForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/tweet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (response.ok) {
            setMessage('');
            // WebSocketを使用して他のコンポーネントに通知するか、再読み込み
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's happening?"
            />
            <button type="submit">Tweet</button>
        </form>
    );
};

export default TweetForm;
