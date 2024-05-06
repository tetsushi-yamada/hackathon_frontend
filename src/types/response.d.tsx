// src/types/response.d.ts
import { User } from './user.d';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Userデータに対するAPI応答の型定義
export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiResponse<User[]>;
