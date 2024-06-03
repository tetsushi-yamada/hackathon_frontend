// src/types/follow.d.ts
export interface Follow {
    user_id: string;
    follow_id: string;
    created_at: string;
}

export interface Follows {
    follows: Follow[];
    count: number;
}