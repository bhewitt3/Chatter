import {Request, Response} from 'express';
import { createConversationWithInitialMessage, getConversationsByUser, getMessagesByConversationId } from '../repositories/chatRepository';
import { User } from '../models/user/user.types';
import { getUserByDisplayName } from '../repositories/userRepository';
import { AuthenticatedRequest } from '../middleware/auth';
import { ConversationPreview } from '../models/conversation/conversation.types';
import { Message } from '../models/message/message.types';

export const startConversation = async (req: AuthenticatedRequest, res: Response) => {
    const { recipientDisplayName, message} = req.body;
    const userId = req.userId!;
    const recipient: User | null = await getUserByDisplayName(recipientDisplayName);

    if (!recipient){
        res.status(404).json({
            type: 'error',
            message: 'Recipient not found.'
        });
        return;
    }
    const createSuccess = await createConversationWithInitialMessage(userId, recipient.Id, message);

    if(createSuccess){
        res.status(200).json({
            type: 'success',
            message: 'Conversation started.'
        });
        return;
    }
    res.status(500).json({
        type: 'error',
        message: 'An error occurred creating the conversation.'
    })
};

export const conversationsByUser = async(req: AuthenticatedRequest, res: Response) => {
    const userId: number = req.userId!;
    const conversations: ConversationPreview[] = await getConversationsByUser(userId);
    res.status(200).json({
        type: 'success',
        message: 'Conversation previews for user.',
        data: conversations
    });
};

export const messagesByConversationId = async (req: AuthenticatedRequest, res: Response) => {
    const {conversationId} = req.body;

    const messages: Message[] = await getMessagesByConversationId(conversationId);

    res.status(200).json({
        type: 'success',
        mssage: `Messages for conversationId ${conversationId}.`,
        data: messages
    });
};
