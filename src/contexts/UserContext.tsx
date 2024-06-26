// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

// 型定義
interface UserContextType {
    userId: string;
    setUserId: (userId: string) => void;
}

// 初期値 (必要に応じて適切なデフォルト値を設定)
const defaultState: UserContextType = {
    userId: '',
    setUserId: () => {}
};

// コンテキストの作成
const UserContext = createContext<UserContextType>(defaultState);

// プロバイダコンポーネント
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string>(() => {
        // 初期化時にローカルストレージから値を読み取る
        return localStorage.getItem('userId') || '';
    });

    useEffect(() => {
        // userIdが変更された時にローカルストレージに保存する
        localStorage.setItem('userId', userId);
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// カスタムフック
export const useUser = (): UserContextType => useContext(UserContext);
