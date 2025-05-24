export interface User {
    Id: number,
    Username: string,
    DisplayName: string,
    Email: string,
    PasswordHash: string,
    ProfileImageUrl?: string,
    createdAt: Date
}