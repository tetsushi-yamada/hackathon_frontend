import axios from "axios";
import config from "../url/index";
import { FollowRequests } from "../../types/follow_request.d";

const API_URL = config.apiUrl + "/v1/follows/request";

export const checkFollowRequest = async (userId: string, followId: string): Promise<boolean> => {
    try {
        const response = await axios.get<{bool: boolean}>(`${API_URL}/${userId}/${followId}`);
        return response.data.bool;
    } catch (error) {
        console.error("Error checking follow request:", error);
        throw error;
    }
}

export const getFollowRequests = async (userId: string): Promise<FollowRequests> => {
    try {
        const response = await axios.get<FollowRequests>(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching follow requests:", error);
        throw error;
    }
};

export const updateFollowRequest = async (userId: string, followId: string, status: string): Promise<void> => {
    try {
        await axios.put(`${API_URL}`, {
            user_id: userId,
            follow_id: followId,
            status: status,
        });
    } catch (error) {
        console.error("Error updating follow request:", error);
        throw error;
    }
}