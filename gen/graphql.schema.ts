
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IMutation {
    addPost(message: string): string | Promise<string>;
    login(password: string, username: string): LoginResponse | Promise<LoginResponse>;
    refreshToken(refreshToken: string): string | Promise<string>;
}

export interface IQuery {
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface RefreshToken {
    createdAt: DateTime;
    expiresAt: DateTime;
    id: string;
    revoked: boolean;
}

export interface ISubscription {
    postsAdded(): string | Promise<string>;
}

export interface User {
    id: string;
    refreshTokens: RefreshToken[];
}

export type DateTime = any;
type Nullable<T> = T | null;
