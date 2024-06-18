import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

interface OpenAIResponse {
    choices: { 
        message: {
            role: string;
            content: string;
        };
    }[];
}

export const checkTweetForInappropriateness = async (tweet: string): Promise<boolean> => {
    try {
        const prompt = `Please determine if the following tweet is inappropriate:\nTweet: "${tweet}"\nResponse with "yes" or "no".`;
        const response = await axios.post<OpenAIResponse>(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
            }
        );

        const result = response.data.choices[0].message.content.trim().toLowerCase();
        return result === 'yes';
    } catch (error) {
        console.error('Error checking tweet for inappropriateness:', error);
        throw error;
    }
};

export const generateTranslatedTweet = async(tweet: string, language: string): Promise<string> => {
    try {
        const prompt = `Translate the following tweet to ${language}:\nTweet: "${tweet}"`;
        const response = await axios.post<OpenAIResponse>(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating translated tweet:', error);
        throw error;
    }
}