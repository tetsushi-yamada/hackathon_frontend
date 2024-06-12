// src/types/user.d.ts
export interface User {
    user_id: string;
    user_name: string;
    user_description: string;
    is_private: boolean;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Users {
    users: User[];
    count: number;
}