import dotenv from 'dotenv';
import {Pool} from 'pg';

dotenv.config();

const {
    POSTGRES_PASSWORD,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_HOST,
} = process.env;

export class DbConnection {
    public getPool(): Pool {
        return new Pool({
            host: POSTGRES_HOST,
            database: POSTGRES_DB,
            password: POSTGRES_PASSWORD,
            user: POSTGRES_USER,
        });
    }
}
