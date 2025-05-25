export interface UserLoginResponseDTO {
    Id: number;
    Username: string;
    DisplayName: string;
    Email: string;
    ProfileImageUrl?: string;
}

export interface UserLoginRequestDTO {
    username: string;
    password: string;
}