export interface ConversationPreview {
    Id: number,
    Name: string,
    IsGroup: Boolean,
    CreatedBy: number,
    LastMessage: string,
    LastMessageAt: Date,
    WithUserId: number,
    WithUserDisplay: string,
    WithUserAvatar: string,
    ReadAt: Date | null,
    SenderId: number
}
export interface ConversationUpdatePayload {
    Id: number,
    LastMessage: string,
    LastMessageAt: Date,
    SenderId: number,
    ReadAt: Date
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
    isEdited: boolean,
    ReadAt: Date
}
export interface InitialMessageInput {
    recipientDisplayName: string,
    message: string
}