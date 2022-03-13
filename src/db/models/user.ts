import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {Pool} from "pg";

dotenv.config();
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS
} = process.env;

export type User = {
    id?: number;
    firstName: string,
    lastName: string,
    password?: string,
    username: string,
}

export class UserStore {
    client: Pool;

    constructor(client: Pool) {
        this.client = client;
    }

    async findOne(id: number): Promise<User> {
        try {
            const connection = await this.client.connect();
            const sql = `SELECT id, firstname, lastname, username
                         FROM users
                         WHERE id = ${id}`;
            const result = await connection.query(sql);
            connection.release();
            if (result.rowCount !== 1) {
                throw new Error(`Product with id: ${id} was not found.`);
            }
            return result.rows[0];
        } catch (e) {
            throw new Error(`Error searching user with id: ${id} ${e}`);
        }
    }

    async findAll(limit: number = 5, offset: number = 0): Promise<User[]> {
        try {
            const connection = await this.client.connect();
            const sql = `SELECT id, firstname, lastname, username
                         FROM users
                         LIMIT ${limit} OFFSET ${offset}`;
            const result = await connection.query(sql);
            connection.release();
            if (result.rowCount === 0) {
                return [];
            }

            return result.rows;
        } catch (e) {
            throw new Error(`Error requesting all users: ${e}`);
        }
    }

    async create(userToCreate: User): Promise<User> {
        try {
            const connection = await this.client.connect();
            // @ts-ignore
            const pwHash = bcrypt.hashSync(userToCreate.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS))
            const sql = `INSERT INTO users(firstname, lastname, password, username)
                         VALUES (?, ?, ?, ?)
                         RETURNING id, firstname, lastname, username`;
            const result = await connection.query(sql, [userToCreate.firstName, userToCreate.lastName, pwHash, userToCreate.username]);
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Error creating user with username: ${userToCreate.username}: ${e}`);
        }
    }
}
