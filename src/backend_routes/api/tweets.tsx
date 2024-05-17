import axios from 'axios';
import { Tweets } from '../../types/tweet.d';
import config from '../url/index'

const API_URL = config.apiUrl + '/v1/tweets';

// Create a new tweet
export const createTweet = async (userId: string, tweetText: string): Promise<string> => {
    try {
        const response = await axios.post(API_URL, {
            user_id: userId,
            tweet_text: tweetText
        });
        console.log('Tweet created with ID:', response.data);
        return response.data; // ツイートIDを返す
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
};

// Get tweets by user ID
export const getTweetsByUserID = async (userId: string): Promise<Tweets> => {
    try {
        const response = await axios.get<Tweets>(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
};

export const updateTweet = async (tweet_id: string, tweet_text: string): Promise<void> => {
    try {
        const response = await axios.put(`${API_URL}/by-tweet/${tweet_id}`, {
            tweet_text: tweet_text
        });
        if (response.status === 204) {
            console.log('Tweet updated successfully');
        }
    } catch (error) {
        console.error('Error updating tweet:', error);
        throw error;
    }
}

// Delete a tweet by ID
export const deleteTweet = async (tweet_id: string): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}/by-tweet/${tweet_id}`);
        if (response.status === 204) {
            console.log('Tweet deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting tweet:', error);
        throw error;
    }
};
