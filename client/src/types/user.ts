export interface LoginCredentials {
    username: string,
    password: string
}

export interface SignUpCredentials {
    username: string,
    displayName: string,
    email: string,
    password: string
}

export interface User {
    id: number,
    username: string,
    displayName: string,
    email: string,
    profileImageUrl?: string
}