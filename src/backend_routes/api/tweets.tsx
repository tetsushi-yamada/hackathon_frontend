import axios from 'axios';
import { Tweet, Tweets } from '../../types/tweet.d';
import config from '../url/index'
import { checkTweetForInappropriateness } from './openapi';

const API_URL = config.apiUrl + '/v1/tweets';

// Create a new tweet
export const createTweet = async (userId: string, tweetText: string, is_inappropriate: boolean): Promise<string> => {
    try {
        const response = await axios.post(API_URL, {
            user_id: userId,
            tweet_text: tweetText,
            is_inappropriate: is_inappropriate
        });
        console.log('Tweet created with ID:', response.data);
        return response.data; // ツイートIDを返す
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
};

export const createReplyTweet = async (userId: string, tweetText: string, parentId: string, is_inappropriate: boolean): Promise<string> => {
    try {
        const response = await axios.post(API_URL, {
            user_id: userId,
            tweet_text: tweetText,
            parent_id: parentId,
            is_inappropriate: is_inappropriate
        });
        console.log('Tweet created with ID:', response.data);
        return response.data; // ツイートIDを返す
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
}

export const createRetweet = async (userId: string, tweet_text: string, tweetId: string, is_inappropriate: boolean): Promise<string> => {
    try {
        const response = await axios.post(API_URL, {
            user_id: userId,
            tweet_text: tweet_text,
            retweet_id: tweetId,
            is_inappropriate: is_inappropriate
        });
        console.log('Tweet created with ID:', response.data);
        return response.data; // ツイートIDを返す
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
}

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

export const getTweetsByTweetID = async (tweetId: string): Promise<Tweet> => {
    try {
        const response = await axios.get<Tweet>(`${API_URL}/by-tweet/${tweetId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }

}

export const updateTweet = async (tweet_id: string, tweet_text: string): Promise<void> => {
    try {
        const is_inappropriate = await checkTweetForInappropriateness(tweet_text);
        const response = await axios.put(`${API_URL}/by-tweet/${tweet_id}`, {
            tweet_text: tweet_text,
            is_inappropriate: is_inappropriate
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

export const searchTweets = async (searchWord: string): Promise<Tweets> => {
    try {
        const response = await axios.get<Tweets>(`${API_URL}/search/${searchWord}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
}

export const getReplies = async (tweet_id: string): Promise<Tweets> => {
    try {
        const response = await axios.get<Tweets>(`${API_URL}/reply/${tweet_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
}

export const getRetweets = async (tweet_id: string): Promise<Tweets> => {
    try {
        const response = await axios.get<Tweets>(`${API_URL}/retweet/${tweet_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
}