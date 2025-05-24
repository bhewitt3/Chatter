export interface Message {
    Id: number,
    ConversationId: number,
    SenderId: number,
    Content: string,
    MessageType: string | null,
    SentAt: Date,
    isEdited: boolean
}