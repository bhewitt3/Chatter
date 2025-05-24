export interface UserLoginResponseDTO {
    id: number;
    username: string;
    displayName: string;
    email: string;
    ProfileImageUrl?: string;
}

export interface UserLoginRequestDTO {
    username: string;
    password: string;
}