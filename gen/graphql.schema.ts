
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IMutation {
    addPost(message: string): string | Promise<string>;
    login(password: string, username: string): string | Promise<string>;
}

export interface IQuery {
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface ISubscription {
    postsAdded(): string | Promise<string>;
}

export interface User {
    id: string;
}

type Nullable<T> = T | null;
