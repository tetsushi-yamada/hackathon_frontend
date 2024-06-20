import axios from 'axios';
import config from '../url/index';

const API_URL = config.apiUrl + "/v1/profile-pictures";

export const fetchProfilePictureByUserId = async (user_id: string): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/${user_id}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const uploadProfilePicture = async (selectedFile: File | null, userId: string): Promise<void> => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);
    formData.append('user_id', userId);

    try {
        const response = await axios.put(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('Profile picture uploaded successfully');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};
