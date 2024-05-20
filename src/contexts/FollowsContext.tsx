import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFollows } from '../backend_routes/api/follow';
import { useUser } from './UserContext';

interface FollowContextType {
    followStatus: { [userId: string]: boolean };
    toggleFollow: (userId: string) => void;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const FollowProvider: React.FC<ProviderProps> = ({ children }) => {
    const [followStatus, setFollowStatus] = useState<{ [userId: string]: boolean }>({});
    const { userId } = useUser(); // useUser を使用して現在のユーザーIDを取得

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const followedUsersData = await getFollows(userId);
                const followStatusMap: { [userId: string]: boolean } = {};
                followedUsersData.follows.forEach(follow => {
                    followStatusMap[follow.user_id] = true;
                });
                setFollowStatus(followStatusMap);
            } catch (error) {
                console.error('Failed to fetch follow status', error);
                setFollowStatus({});
            }
        };

        if (userId) {
            fetchFollowStatus();
        }
    }, [userId]);

    useEffect(() => {
        // followStatusが変更された時にローカルストレージに保存する
        localStorage.setItem('followStatus', JSON.stringify(followStatus));
    }, [followStatus]);

    const toggleFollow = (userId: string) => {
        setFollowStatus(prevStatus => ({
            ...prevStatus,
            [userId]: !prevStatus[userId]
        }));
    };

    return (
        <FollowContext.Provider value={{ followStatus, toggleFollow }}>
            {children}
        </FollowContext.Provider>
    );
};

export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) {
        throw new Error('useFollow must be used within a FollowProvider');
    }
    return context;
};
