import { select, create } from "../helpers/db";
import { User } from "../models/user/user.types";

export const getUserById = async (id: number): Promise<User | null> => {
    const users = await select<User>(
        `SELECT * FROM Users WHERE Id = @id`,
        { id }
    );
    return users[0] ?? null;
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const users = await select<User>(
        `SELECT * FROM Users WHERE Username = @username`,
        { username }
    );
    return users[0] ?? null;
};

export const getUserByDisplayName = async (displayName: string): Promise<User | null> => {
    const user = await select<User>(
        `SELECT * FROM Users WHERE LOWER(LTRIM(RTRIM(DisplayName))) = LOWER(@displayName)`, 
        { displayName }
    );
    return user[0] ?? null;
}

export const getUserByEmailOrUsername = async (username: string, email: string): Promise<User | null> => {
    const users = await select<User>(
        `SELECT * FROM Users WHERE Username = @username OR Email = @email`,
        { username, email }
    );
    return users [0] ?? null;
}

export const createUser = async (
    username: string,
    displayName: string,
    email: string,
    passwordHash: string,
    avatarUrl: string | null
): Promise<Boolean> => {

    const query = `
        INSERT INTO Users (Username, DisplayName, Email, PasswordHash, ProfileImageUrl)
        VALUES (@username, @displayName, @email, @passwordHash, @avatarUrl);
    `;

    const rowsAffected = await create(query, {
        username,
        displayName,
        email,
        passwordHash,
        avatarUrl
    });
    return rowsAffected > 0;
};

export const searchByDisplayName = async (query: string): Promise<User[]> => {
    const users = await select<User>(
        `SELECT * FROM Users WHERE DisplayName LIKE @query`,
        { query: `%${query}%` }
    );
    return users;
}