import {Pool} from "pg";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
}

export class ProductStore {
    client: Pool;
    constructor(client: Pool) {
        this.client = client;
    }
    async findOne(id: number): Promise<Product> {
        try {
            const connection = await this.client.connect();
            const sql = `SELECT id, name, price, category
                     FROM products
                     WHERE id = ${id}`;
            const result = await connection.query(sql);
            connection.release();
            if (result.rowCount !== 1) {
                throw new Error(`Product with id: ${id} was not found.`);
            }
            return result.rows[0];
        } catch (e) {
            throw new Error(`Error querying users. ${e}`)
        }
    }

    async findAll(limit: number = 5, offset: number = 0, category?: string): Promise<Product[]> {
        try {
            const connection = await this.client.connect();
            const order = category === undefined ? "" : ` WHERE category LIKE '${category}' `;
            const sql = `SELECT id, name, price, category
                     FROM products ${order} LIMIT ${limit} OFFSET ${offset}`;
            const result = await connection.query(sql);
            connection.release();
            if (result.rowCount === 0) {
                return [];
            }

            return result.rows;
        } catch (e) {
            throw new Error(`Error querying users. ${e}`)
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const connection = await this.client.connect();
            const sql = `INSERT INTO products(name, price, category)
                     VALUES ('${product.name}', ${product.price}, '${product.category}')
                     RETURNING id, name, price, category`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Error creating user. ${e}`)
        }
    }
}
