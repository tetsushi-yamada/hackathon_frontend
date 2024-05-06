// src/contexts/TweetContext.tsx
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

// 型定義
interface TweetContextType {
    tweetId: string;
    setTweetId: (tweetId: string) => void;
}

// 初期値 (必要に応じて適切なデフォルト値を設定)
const defaultState: TweetContextType = {
    tweetId: '',
    setTweetId: () => {}
};

// コンテキストの作成
const TweetContext = createContext<TweetContextType>(defaultState);

// プロバイダコンポーネント
interface TweetProviderProps {
    children: ReactNode;
}

export const TweetProvider: FC<TweetProviderProps> = ({ children }) => {
    const [tweetId, setTweetId] = useState<string>('');

    return (
        <TweetContext.Provider value={{ tweetId, setTweetId }}>
            {children}
        </TweetContext.Provider>
    );
};

// カスタムフック
export const useTweet = (): TweetContextType => useContext(TweetContext);
