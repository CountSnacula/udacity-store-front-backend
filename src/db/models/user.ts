import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {Pool} from "pg";

export type User = {
    id?: number;
    firstName: string,
    lastName: string,
    password?: string,
    username: string,
}

export class UserStore {
    client: Pool;
    bcryptPassword;
    saltRounds;

    constructor(client: Pool) {
        this.client = client;
        dotenv.config();
        const {
            BCRYPT_PASSWORD,
            SALT_ROUNDS
        } = process.env;
        if (BCRYPT_PASSWORD === undefined || SALT_ROUNDS  === undefined) {
            throw new Error("BCRYPT_PASSWORD and/ or SALT_ROUNDS not set");
        }
        this.bcryptPassword = BCRYPT_PASSWORD;
        this.saltRounds = SALT_ROUNDS;
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
            const pwHash = bcrypt.hashSync(userToCreate.password + this.bcryptPassword, parseInt(this.saltRounds));
            const sql = `INSERT INTO users(firstname, lastname, password, username)
                         VALUES ('${userToCreate.firstName}', '${userToCreate.lastName}', '${pwHash}', '${userToCreate.username}')
                         RETURNING id, firstname, lastname, username`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Error creating user with username: ${userToCreate.username}: ${e}`);
        }
    }

    async findAndValidate(username: string, password: string): Promise<User> {
        try {
            const con = await this.client.connect();
            const sql = `SELECT id, firstname, lastname, username, password
                         FROM users WHERE username LIKE '${username}'`;
            const resp = await con.query(sql);
            if (resp.rowCount !== 1) {
                throw new Error(`User ${username} does not exits.`);
            }
            const user: User = resp.rows[0];
            con.release();
            if (user.password !== undefined && !bcrypt.compareSync(password + this.bcryptPassword, user.password)) {
                throw new Error(`User ${username} unauthorized.`);
            }
            user.password = undefined;
            return user;
        } catch (e) {
            throw new Error(`User ${username} does not exits.`);
        }
    }
}
