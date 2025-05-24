export interface Conversation {
    Id: number,
    Name: string,
    IsGroup: boolean,
    CreatedBy: number,
    CreatedAt: Date
}
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