import axios from 'axios';
import config from '../url/index'
import { Follow, Follows } from '../../types/follow.d';

const API_URL = config.apiUrl + '/v1/follows';

// Get all followers for a specific user
export const getFollows = async (userId: string): Promise<Follows> => {
    try {
        const response = await axios.get<Follows>(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw error;
    }
};

// Create a follow relationship
export const createFollow = async (userId: string, followId: string): Promise<Follow> => {
    try {
        const response = await axios.post<Follow>(API_URL, {
            user_id: userId,
            follow_id: followId
        });
        return response.data;
    } catch (error) {
        console.error('Error creating follow:', error);
        throw error;
    }
};

// フォロー関係を削除する関数
export const deleteFollow = async (userId: string, followId: string): Promise<void> => {
    try {
        const url = `${API_URL}/${encodeURIComponent(userId)}/${encodeURIComponent(followId)}`;
        const response = await axios.delete(url);
        if (response.status !== 200) {
            throw new Error('Failed to delete follow relationship');
        }
    } catch (error) {
        console.error('Error deleting follow relationship:', error);
        throw error;
    }
};

// ユーザーが別のユーザーをフォローしているかを確認する関数
export const checkFollow = async (userId: string, followId: string): Promise<boolean> => {
    try {
        const url = `${API_URL}/${encodeURIComponent(userId)}/${encodeURIComponent(followId)}`;
        const response = await axios.get<{ bool: boolean }>(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch follow status');
        }
        return response.data.bool;
    } catch (error) {
        console.error('Error checking follow status:', error);
        throw error;
    }
};

