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

        const formData = new FormData();

        formData.append("username", credentials.username);
        formData.append("displayName", credentials.displayName);
        formData.append("email", credentials.email);
        formData.append("password", credentials.password);

        if (credentials.avatar){
            formData.append("avatar", credentials.avatar);
        }
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: formData,
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

export const userById = async(userId: number): Promise<ApiResponse<User>> => {
    try{ 
        const response = await fetch('/api/auth/userbyid', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({userId: userId})
        });
        const data: ApiResponse<User> = await response.json();
        return data;
    } catch (err) {
        return {
            type: 'error',
            message: `An error occurred fetching user by id: ${err}`
        }
    }
};

export const usersByDisplayName = async(query: string): Promise<ApiResponse<User[]>> => {
    try{
        const response = await fetch('/api/auth/searchDisplayNames', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({query: query})
        });

        const data: ApiResponse<User[]> = await response.json();
        return data
    } catch (err) {
        return {
            type: 'error',
            message: 'An error occurred fetching users'
        }
    }
};