import type { ApiResponse } from "../types/api";
import type { LoginCredentials, SignUpCredentials } from "../types/user";
import type { User } from "../types/user";

export const login = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(credentials),
            credentials: 'include'
        });

        const data: ApiResponse<User> = await response.json();
        return data;

    } catch (err){
        return {
            type: 'error',
            message: 'An error occurred.'
        }
    }
};

export const signUp = async (credentials: SignUpCredentials): Promise<ApiResponse<User>> => {
    try{
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(credentials),
            credentials: 'include'
        });

        const data: ApiResponse<User> = await response.json();
        return data;
    } catch (err) {
        return {
            type: "error",
            message: 'An error occurred.'
        }
    }
};