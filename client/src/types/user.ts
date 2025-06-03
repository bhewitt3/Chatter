export interface LoginCredentials {
    username: string,
    password: string
}

export interface SignUpCredentials {
    username: string,
    displayName: string,
    email: string,
    password: string,
    avatar?: File | null;
}

export interface User {
    Id: number,
    Username: string,
    DisplayName: string,
    Email: string,
    ProfileImageUrl?: string
}