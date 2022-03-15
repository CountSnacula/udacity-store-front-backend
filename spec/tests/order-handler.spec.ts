import {Order, OrderStatus, OrderStore, ProductOrder} from "../../src/db/models/order";
import {OrderHandler} from "../../src/db/handler/order-handler";
import {TokenService} from "../../src/db/service/token-service";
import {ProductHandler} from "../../src/db/handler/product-handler";
import {UserHandler} from "../../src/db/handler/user-handler";
import {Server} from "http";
import {StoreFront} from "../../src/storefront";
import {LoginHandler} from "../../src/db/handler/login-handler";
import request from 'supertest';
import {UserStore} from "../../src/db/models/user";
import jwt from "jsonwebtoken";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;


describe("Order Handler tests", () => {
    let underTest: Server;
    const orderSpy: SpyObj<OrderStore> = createSpyObj("OrderStore", ["findActive", "createOrder", "completeOrder"]);

    let authHeaderValue;
    let auth: object;

    beforeEach(() => {
        const jwtSecret = "secret";
        process.env.JWT_SECRET = jwtSecret;
        const productHandler: SpyObj<ProductHandler> = createSpyObj("ProductHandler", ["initRoutes"]);
        const userHandler: SpyObj<UserHandler> = createSpyObj("UserHandler", ["initRoutes"]);
        const loginHandler: SpyObj<LoginHandler> = createSpyObj("LoginHandler", ["initRoutes"]);
        const userStoreSpy: SpyObj<UserStore> = createSpyObj("UserStore", ["findAndValidate"]);
        const tokenService = new TokenService(userStoreSpy);
        const orderHandler: OrderHandler = new OrderHandler(orderSpy, tokenService);


        authHeaderValue = `Bearer: ${jwt.sign({test: "test"}, jwtSecret)}`;
        auth = {
            Authorization: authHeaderValue
        };

        underTest = new StoreFront(productHandler, userHandler, orderHandler, loginHandler).startServer();
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
        underTest.close();
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

        orderSpy.createOrder.and.resolveTo(order);

        await request(underTest).post(`/users/${userId}/orders`).set(auth)
            .send(order).expect(200, order);
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

        orderSpy.findActive.and.resolveTo(order);

        await request(underTest).get(`/users/${userId}/orders/active`).set(auth).expect(200, order);
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

        orderSpy.completeOrder.and.resolveTo(order);

        await request(underTest).put(`/users/${userId}/orders/${id}`).set(auth)
            .expect(200, order);
        expect(orderSpy.completeOrder).toHaveBeenCalledWith(userId, id);
    });
});
