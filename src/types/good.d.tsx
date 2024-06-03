export interface Good {
    tweet_id: string;
    user_id: string;
    created_at: string;
}

export interface Goods {
    goods: Good[];
    count: number;
}