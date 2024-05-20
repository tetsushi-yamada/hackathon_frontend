import axios from 'axios';
import config from '../url/index'
import { Goods } from '../../types/good.d';

const API_URL = config.apiUrl + "/v1/goods";

export const fetchGoodsByTweetId = async (tweet_id: string): Promise<Goods> => {
    try {
    const response = await axios.get<Goods>(`${API_URL}?tweet_id=${tweet_id}`);
    return response.data;
} catch (error) {
    console.error('Error fetching goods:', error);
    throw error;
}
};

export const fetchGoodsByUserId = async (user_id: string): Promise<Goods> => {
    try {
    const response = await axios.get<Goods>(`${API_URL}?user_id=${user_id}`);
    return response.data;
} catch (error) {
    console.error('Error fetching goods:', error);
    throw error;
}
};

export const postGood = async (tweet_id:string, user_id: string): Promise<void> => {
    try {
        await axios.post(API_URL, { tweet_id:tweet_id, user_id:user_id });
    } catch (error) {
        console.error('Error posting good:', error);
        throw error;
    }
};


export const deleteGood = async (tweet_id: string, user_id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${tweet_id}/${user_id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};