// src/api/userApi.ts
import axios from 'axios';
import config from '../url/index'
import { User, Users } from '../../types/user.d';

const API_URL = config.apiUrl + "/v1/users";

export const fetchUser = async (user_id: string): Promise<User> => {
    try {
    const response = await axios.get<User>(`${API_URL}/${user_id}`);
    return response.data;
} catch (error) {
    console.error('Error fetching users:', error);
    throw error;
}
};

export const postUser = async (user_id:string, user_name: string): Promise<string> => {
    try {
        const response = await axios.post(API_URL, { user_id:user_id, user_name: user_name });
        if (response.status === 200 || response.status === 201) { 
            return response.data; 
        } else {
            throw new Error('Invalid response');
        }
    } catch (error) {
        console.error('Error posting user:', error);
        throw error;
    }
};

export const updateUser = async (user_id: string, user_name: string, user_description: string, is_private: boolean): Promise<void> => {
    try {
        await axios.put(`${API_URL}/${user_id}`, { user_name: user_name, user_description: user_description, is_private: is_private });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUserDB = async (user_id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${user_id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const searchUser = async (search_word: string): Promise<Users> => {
    try {
        const response = await axios.get<Users>(`${API_URL}/search/${search_word}`);
        return response.data;
    } catch (error) {
        console.error('Error searching user:', error);
        throw error;
    }
}