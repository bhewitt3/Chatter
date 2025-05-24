export interface ConversationPreview {
    Id: number,
    Name: string,
    IsGroup: Boolean,
    CreatedBy: number,
    LastMessage: string,
    LastMessageAt: Date,
    WithUser: string,
    WithUserAvatar: string
}

export interface ConversationMessages {
    MessageId: number,
    Content: string,
    SentAt: Date,
    SenderId: number
}

export interface ConverationParticipant {
    UserId: number,
    DisplayName: string,
    ProfileImageUrl: string
}

export interface Message {
    Id: number,
    ConversationId: number,
    SenderId: number,
    Content: string,
    MessageType: string | null,
    SentAt: Date,
    isEdited: boolean
}