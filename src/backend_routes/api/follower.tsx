import axios from 'axios';
import config from '../url/index'
import { Follows } from '../../types/follow.d';

const API_URL = config.apiUrl + "/v1/followers";

export const getFollowers = async (followId: string): Promise<Follows> => {
    try {
        const response = await axios.get<Follows>(`${API_URL}/${followId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw error;
    }
};