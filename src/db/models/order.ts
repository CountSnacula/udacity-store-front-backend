import {Pool, PoolClient} from "pg";
import {DbConnection} from "../connection/database";

export enum OrderStatus {
    active = "active",
    complete = "complete",
}

export type ProductOrder = {
    productId: number,
    quantity: number,
}

export type Order = {
    id?: number,
    userId: number,
    status: OrderStatus,
    products?: ProductOrder[],
}

export class OrderStore {
    client: Pool;
    constructor(client: Pool) {
        this.client = client;
    }

    async createOrder(order: Order): Promise<Order> {
        try {
            const con = await this.client.connect();
            await this.completeAllOpenOrders(con, order.userId);
            const insertOrder = `INSERT INTO orders (user_id, status)
                                 VALUES (${order.userId}, '${OrderStatus.active}')
                                 RETURNING id, user_id as userId, status`;
            const insertOrderResult = await con.query(insertOrder);
            const created = insertOrderResult.rows[0];
            if (order.products !== undefined) {
                created.products = await this.createProductOrder(con, order.products, created.id);
            }
            con.release();
            return created;
        } catch (e) {
            throw new Error(`Error while creating order: ${e}`);
        }
    }

    async completeOrder(orderId: number): Promise<Order> {
        try {
            const con = await this.client.connect();
            const sql = `UPDATE orders
                               SET status= '${OrderStatus.complete}'
                               WHERE id = ${orderId}
                               RETURNING id, user_id as userId, status`;

            const updateResult = await con.query(sql);
            const update = updateResult.rows[0];

            const productInfo = await this.findProductInformationForOrder(orderId, con);
            con.release();
            update.products = productInfo;
            return update;
        } catch (e) {
            throw new Error(`Error completing order ${orderId}: ${e}`);
        }
    }

    async findActive(userId: number): Promise<Order> {
        try {
            const con = await this.client.connect();
            const sql = `SELECT o.id as id, o.user_id as userId, o.status as status
                         FROM orders o
                                  inner join users u on u.id = o.user_id
                         WHERE o.user_id = ${userId}
                           AND status LIKE '${OrderStatus.active}'`;
            const result = await con.query(sql);
            if (result.rowCount !== 1) {
                throw new Error("Could not load user order");
            }
            const order = result.rows[0];
            const productInfo = await this.findProductInformationForOrder(order.id, con);
            con.release();
            order.products = productInfo;
            return order
        } catch (e) {
            throw new Error(`Error while querying orders for user ${userId}: ${e}`);
        }
    }

    private async findProductInformationForOrder(orderId: number, con: PoolClient): Promise<ProductOrder[]> {
        try {
            const sql = `SELECT product_id as productId, quantity
                         FROM product_orders
                         WHERE order_id = ${orderId}`;
            const result = await con.query(sql);
            if (result.rowCount === 0) {
                return [];
            }
            return result.rows;
        } catch (e) {
            throw new Error(`Error while querying product orders: ${e}`);
        }
    }

    private async completeAllOpenOrders(con: PoolClient, userId: number): Promise<void> {
        try {
            const sql = `UPDATE orders
                         SET status = '${OrderStatus.complete}'
                         WHERE user_id = ${userId}`;
            await con.query(sql);
        } catch (e) {
            throw new Error(`Error completing all orders for user: ${userId}. Error: ${e}`);
        }
    }

    private async createProductOrder(con: PoolClient, productOrders: ProductOrder[], orderId: number): Promise<ProductOrder> {
        try {
            const values = productOrders.map((po) => `(${po.productId}, ${orderId}, ${po.quantity})`)
                .join(", ");
            const insert = `INSERT INTO product_orders(product_id, order_id, quantity) VALUES ${values} 
                            RETURNING product_id as productId, quantity`;
            const result = await con.query(insert)
            // @ts-ignore
            return result.rows;
        } catch (e) {
            throw new Error(`Error while updating product order information's: ${e}`);
        }
    }
}
