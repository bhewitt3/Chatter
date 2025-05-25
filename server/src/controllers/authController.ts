import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserLoginResponseDTO } from '../models/user/user.dto';
import { getUserByUsername, createUser, getUserByEmailOrUsername, getUserById } from '../repositories/userRepository';
import type { JwtPayload } from '../types';
import { User } from '../models/user/user.types';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response) => {
    const {username, displayName, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400).json({ 
            type: 'error',
            message: "username, email, and password are required."
        });
    }

    try{
        const existingUsers = await getUserByEmailOrUsername(username, email);

        if (existingUsers != null){
            res.status(409).json({
                type: 'error',
                message: 'Username or email already in use.'
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const createSuccess = await createUser(username, displayName, email, passwordHash);

        if(createSuccess){
            res.status(201).json({
                type: 'success',
                message: "User registered successfully."
            });
            return;
        }
        res.status(500).json({
            type: 'error',
            message: 'An error occurred creating the user.'
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            type: 'error',
            message: 'Internal Server Error.'
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try {
        const user: User | null = await getUserByUsername(username);

        if (!user) {
            res.status(401).json({
                type: "error",
                message: 'Invalid username or password.'
            });
            return;
        };
        const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

        if(!passwordMatch){
            res.status(401).json({
                type: 'error',
                message: "Invalid username or password."
            });
            return;
        };

        const userResponse: UserLoginResponseDTO = {
            Id: user.Id,
            Username: user.Username,
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImageUrl: user.ProfileImageUrl
        };

        const token = jwt.sign({
            userId: user.Id,
            username: user.Username
            },
            JWT_SECRET,
            {expiresIn: '1h'}
        );
         res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({ 
            type: "success",
            message: "Login successful",
            data: userResponse   
        });
    } catch(err) {
        console.error("Login failed:", err);
        if (err instanceof Error){
            res.status(500).json({
                type: "error",
                message: err.message || "Internal server error"
            });  
        }
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            type: 'error',
            message: 'Not authenticated.'
        });
        return;
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const user: User | null = await getUserById(decoded.userId);

        if(!user){
            res.status(404).json({
                type: 'error',
                message: 'User not found.'
            });
            return;
        }

        const userResponse: UserLoginResponseDTO = {
            Id: user.Id,
            Username: user.Username,
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImageUrl: user.ProfileImageUrl
        };

        res.status(200).json({
            type: 'success',
            message: 'User authenticated.',
            data: userResponse
        });
    } catch (err) {
        res.status(500).json({
            type: 'error',
            message: 'Internal error.'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({
        type: 'success',
        message: 'Logged out successfully.'
    });
};

export const userById = async (req: Request, res: Response) => {
    const {userId} = req.body;
    try{
       const user: User | null = await getUserById(userId);

        if (!user){
            res.status(404).json({
                type: 'error',
                message: 'User not found.'
            });
            return;
        }
        res.status(200).json({
            type: 'success',
            message: 'User by id.',
            data: user
        }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({
            type: 'error',
            message: err
        });
    }
};