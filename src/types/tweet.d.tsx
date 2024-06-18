// src/types/tweet.d.ts
export interface Tweet {
    tweet_id: string;
    user_id: string;
    parent_id: string | null;
    retweet_id: string | null;
    tweet_text: string;
    is_inappropriate: boolean;
    created_at: string;
    updated_at: string;
}

export interface Tweets {
    tweets: Tweet[];
    count: number;
}

export interface TweetWithUserName extends Tweet {
    user_name: string;
}

export interface TweetWithUserNameAndAppropriate extends TweetWithUserName {
    is_inappropriate: boolean;
}