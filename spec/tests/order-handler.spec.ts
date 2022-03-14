import {Order, OrderStatus, OrderStore, ProductOrder} from "../../src/db/models/order";
import {OrderHandler} from "../../src/db/handler/order-handler";
import SpyObj = jasmine.SpyObj;
import {Application, Request, Response} from "express";
import createSpyObj = jasmine.createSpyObj;
import exp = require("constants");


describe("Order Handler tests", () => {
    let underTest: OrderHandler;
    const orderSpy: SpyObj<OrderStore> = createSpyObj("OrderStore", ["findActive", "createOrder", "completeOrder"]);

    beforeEach(() => {
        underTest = new OrderHandler(orderSpy);

    });

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it('should create a new order', async () => {
        const id = 1;
        const products: ProductOrder[] = [{
            productId: 2,
            quantity: 5,
        }];
        const userId = 3;
        const status: OrderStatus = OrderStatus.active;
        const order: Order = {
            id,
            products,
            userId,
            status
        };

        const req: Request = {
            params: {
                userId: userId
            },
            body: order
        } as unknown as Request;

        orderSpy.createOrder.and.resolveTo(order);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.create(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(order);
        expect(orderSpy.createOrder).toHaveBeenCalledWith(order, userId);
    });

    it('should get active order', async () => {
        const id = 1;
        const products: ProductOrder[] = [{
            productId: 2,
            quantity: 5,
        }];
        const userId = 3;
        const status: OrderStatus = OrderStatus.active;
        const order: Order = {
            id,
            products,
            userId,
            status
        };

        const req: Request = {
            params: {
                userId: userId
            }
        } as unknown as Request;

        orderSpy.findActive.and.resolveTo(order);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.getActive(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(order);
        expect(orderSpy.findActive).toHaveBeenCalledWith(userId);
    });

    it('should complete an order', async () => {
        const id = 1;
        const products: ProductOrder[] = [{
            productId: 2,
            quantity: 5,
        }];
        const userId = 3;
        const status: OrderStatus = OrderStatus.active;
        const order: Order = {
            id,
            products,
            userId,
            status
        };

        const req: Request = {
            params: {
                userId: userId,
                orderId: id
            }
        } as unknown as Request;

        orderSpy.completeOrder.and.resolveTo(order);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.complete(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(order);
        expect(orderSpy.completeOrder).toHaveBeenCalledWith(userId, id);
    });

    it('should set the correct routes', () => {
        const appSpy = createSpyObj("Application", ["get", "put", "post"])
        appSpy.get.and.callFake((url: string) => {
            expect(url).toBe("/users/:userId/orders/active");
        });
        appSpy.put.and.callFake((url: string) => {
            expect(url).toBe("/users/:userId/orders/:orderId");
        });
        appSpy.post.and.callFake((url: string) => {
            expect(url).toBe("/users/:userId/orders");
        });
        underTest.initRoutes(appSpy);
    });
});
