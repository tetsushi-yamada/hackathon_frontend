import axios from "axios";
import config from "../url/index";

const API_URL = config.apiUrl + "/v1/blocks";

export const createBlock = async (userId: string, blockId: string): Promise<void> => {
    try {
        await axios.post(API_URL, {
            user_id: userId,
            block_id: blockId,
        });
    } catch (error) {
        console.error("Error creating block:", error);
        throw error;
    }
}

export const deleteBlock = async (userId: string, blockId: string): Promise<void> => {
    try {
        const url = `${API_URL}/${encodeURIComponent(userId)}/${encodeURIComponent(blockId)}`;
        const response = await axios.delete(url);
        if (response.status !== 204) {
            throw new Error("Failed to delete block relationship");
        }
    } catch (error) {
        console.error("Error deleting block relationship:", error);
        throw error;
    }
}

export const checkBlock = async (userId: string, blockId: string): Promise<boolean> => {
    try {
        const url = `${API_URL}/${encodeURIComponent(userId)}/${encodeURIComponent(blockId)}`;
        const response = await axios.get<{ bool: boolean }>(url);
        if (response.status !== 200) {
            throw new Error("Failed to fetch block status");
        }
        return response.data.bool;
    } catch (error) {
        console.error("Error checking block status:", error);
        throw error;
    }
}

