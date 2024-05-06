// src/types/tweet.d.ts
export interface Tweet {
    tweet_id: string;
    user_id: string;
    tweet_text: string;
    created_at: string;
    updated_at: string;
}

export interface Tweets {
    tweets: Tweet[];
    count: number;
}