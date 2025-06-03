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
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({conversationId: conversationId}),
            credentials: 'include'
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
};

export const saveMessage = async (conversationId: number, senderId: number, content: string): Promise<ApiResponse<Message>> => {
    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                conversationId: conversationId,
                senderId: senderId,
                content: content
            }),
            credentials: 'include'
        });

        const data = await response.json();
        return data;
    } catch(err) {
        console.error(err);
        return {
            type: 'error',
            message: 'Failed to save message'
        }
    }
};

export const startConversation = async (userId: number, recipientDisplay: string, message: string): Promise<ApiResponse<ConversationPreview>> => {
    try{
        const response = await fetch('/api/chat/new', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                userId: userId,
                recipientDisplayName: recipientDisplay,
                message: message
            })
        });

        const data: ApiResponse<ConversationPreview> = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return {
            type: 'error',
            message: 'Failed to create new conversation'
        }
    }
}