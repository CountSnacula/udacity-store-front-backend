import {Application, Request, Response} from "express";
import {Order, OrderStore} from "../models/order";

export class OrderHandler {
    private orderStore: OrderStore;

    constructor(orderStore: OrderStore) {
        this.orderStore = orderStore;
    }

    async create(req: Request, resp: Response) {
        const userId = req.params.userId;
        if (userId === undefined) {
            resp.status(400);
            resp.send({
                message: "No user id present"
            });
        }
        try {
            const created: Order = await this.orderStore.createOrder(req.body, parseInt(userId));
            resp.send(created);
        } catch (e) {
            resp.status(500);
            resp.send(e);
        }
    }

    async getActive(req: Request, resp: Response) {
        const userId = req.params.userId;
        if (userId === undefined) {
            resp.status(400);
            resp.send({
                message: "No user id present"
            });
        }

        try {
            const active: Order = await this.orderStore.findActive(parseInt(userId));
            resp.send(active);
        } catch (e) {
            resp.status(500);
            resp.send(e);
        }
    }

    async complete(req: Request, resp: Response) {
        const userId = req.params.userId;
        const orderId = req.params.orderId;
        if (userId === undefined || orderId === undefined) {
            resp.status(400);
            resp.send({
                message: "No user id or orderId present"
            });
        }

        try {
            const active: Order = await this.orderStore.completeOrder(parseInt(userId), parseInt(orderId));
            resp.send(active);
        } catch (e) {
            resp.status(500);
            resp.send(e);
        }
    }

    initRoutes(app: Application): void {
        app.get("/users/:userId/orders/active", (req, resp) => this.getActive(req, resp));
        app.put("/users/:userId/orders/:orderId", (req, resp) => this.complete(req, resp));
        app.post("/users/:userId/orders", (req, resp) => this.create(req, resp));
    }
}
