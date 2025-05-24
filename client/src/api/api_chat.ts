import type { ApiResponse } from "../types/api";
import type { ConversationPreview, Message } from "../types/chat";

export const getConversations = async (): Promise<ApiResponse<ConversationPreview[]>>  => {
    try {
        const response = await fetch('/api/chat/all', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });

        const data: ApiResponse<ConversationPreview[]> = await response.json();
        return data;
    } catch(err){
        console.error(err);
        return {
            type: 'error',
            message: "Failed to fetch conversations."
        }
    }
}

export const getConversationMessages = async (conversationId: number): Promise<ApiResponse<Message[]>> => {
    try{
        const response = await fetch('/api/chat/messages', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(conversationId)
        });

        const data: ApiResponse<Message[]> = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return {
            type: 'error',
            message: 'Failed to fetch conversations.'
        }
    }
}