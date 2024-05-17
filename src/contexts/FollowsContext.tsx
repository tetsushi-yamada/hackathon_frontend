// FollowContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
