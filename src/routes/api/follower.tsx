import axios from 'axios';
import config from '../url/index'
import { Follow } from '../../types/follow.d';

const API_URL = config.apiUrl + "/v1/followers";

export const getFollowers = async (followId: string): Promise<Follow[]> => {
    try {
        const response = await axios.get<Follow[]>(`${API_URL}/${followId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw error;
    }
};