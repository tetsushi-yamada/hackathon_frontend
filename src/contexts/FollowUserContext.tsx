// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

// 型定義
interface FollowUserContextType {
    followUserId: string;
    setFollowUserId: (followUserId: string) => void;
}

// 初期値 (必要に応じて適切なデフォルト値を設定)
const defaultState: FollowUserContextType = {
    followUserId: '',
    setFollowUserId: () => {}
};

// コンテキストの作成
const FollowUserContext = createContext<FollowUserContextType>(defaultState);

// プロバイダコンポーネント
interface FollowUserProviderProps {
    children: ReactNode;
}

export const UserProvider: FC<FollowUserProviderProps> = ({ children }) => {
    const [followUserId, setFollowUserId] = useState<string>('');

    return (
        <FollowUserContext.Provider value={{ followUserId, setFollowUserId }}>
            {children}
        </FollowUserContext.Provider>
    );
};

// カスタムフック
export const useUser = (): FollowUserContextType => useContext(FollowUserContext);
