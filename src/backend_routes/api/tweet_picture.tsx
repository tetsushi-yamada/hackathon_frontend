import axios from 'axios';
import config from '../url/index'

const API_URL = config.apiUrl + '/v1/tweet-picture';

export const getTweetPicture = async (tweet_id: string): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/${tweet_id}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tweet picture:', error);
        throw error;
    }
}

export const uploadTweetPicture = async (selectedFile: File | null, tweet_id: string): Promise<void> => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('tweet_picture', selectedFile);
    formData.append('tweet_id', tweet_id);

    try {
        const response = await axios.put(`${API_URL}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('Tweet picture uploaded successfully');
        }
    } catch (error) {
        console.error('Error uploading tweet picture:', error);
        throw error;
    }
}