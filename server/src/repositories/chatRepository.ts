import {select, create} from '../db'
import type { ConversationPreview } from '../models/conversation/conversation.types'
import type { Message } from '../models/message/message.types';
export const createConversationWithInitialMessage = async (
    senderId: number,
    recipientId: number,
    message: string
): Promise<boolean> => {
    const query = `
        DECLARE @ConversationId INT;

        -- Step 1: Create conversation
        INSERT INTO Conversations (Name, IsGroup, CreatedBy)
        VALUES (NULL, 0, @senderId);

        SET @ConversationId = SCOPE_IDENTITY();

        -- Step 2: Add both participants
        INSERT INTO ConversationParticipants (ConversationId, UserId)
        VALUES 
            (@ConversationId, @senderId),
            (@ConversationId, @recipientId);

        -- Step 3: Add initial message
        INSERT INTO Messages (ConversationId, SenderId, Content)
        VALUES (@ConversationId, @senderId, @message);
    `;

    const rowsAffected = await create(query, {
        senderId,
        recipientId,
        message
    });

    return rowsAffected > 0;
};

export const getConversationsByUser = async(userId: number): Promise<ConversationPreview[]> => {
    const query = `
        SELECT c.*,
            m.Content AS LastMessage,
            m.SentAt AS LastMessageAt,
            u.DisplayName AS WithUserDisplay,
            u.Id AS WithUserId,
            u.ProfileImageUrl AS WithUserAvatar
        FROM Conversations c
        JOIN ConversationParticipants cp ON c.Id = cp.ConversationId
        OUTER APPLY (
            SELECT TOP 1 m.Content, m.SentAt
            FROM Messages m
            WHERE m.ConversationId = c.Id
            ORDER BY m.SentAt DESC
        ) m
        OUTER APPLY (
            SELECT TOP 1 u.DisplayName, u.ProfileImageUrl, u.Id
            FROM ConversationParticipants cp2
            JOIN Users u ON cp2.UserId = u.Id
            WHERE cp2.ConversationId = c.Id AND cp2.UserId != @userId
        ) u
        WHERE cp.UserId = @userId
        ORDER BY m.SentAt DESC;
    `;

    const conversations: ConversationPreview[] = await select<ConversationPreview>(query, {userId});

    return conversations;
};

export const getMessagesByConversationId = async(conversationId: number): Promise<Message[]> => {
    const query = `
        SELECT *
        FROM Messages
        WHERE ConversationId = @conversationId
        ORDER BY SentAt DESC;
    `;
    const messages: Message[] = await select<Message>(query, {conversationId});
    return messages;
}
