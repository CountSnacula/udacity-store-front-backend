import {Application, Request, Response} from "express";
import {UserHandler} from "../../src/db/handler/user-handler";
import {User, UserStore} from "../../src/db/models/user";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {TokenService} from "../../src/db/service/token-service";
import {ProductHandler} from "../../src/db/handler/product-handler";
import {LoginHandler} from "../../src/db/handler/login-handler";
import {OrderHandler} from "../../src/db/handler/order-handler";
import jwt from "jsonwebtoken";
import {StoreFront} from "../../src/storefront";
import {Server} from "http";
import request from "supertest";


describe("UserHandler tests", () => {
    let underTest: Server;
    const userStore: SpyObj<UserStore> = createSpyObj("UserStore", ["findAll", "findOne", "create"]);

    let auth: object;

    beforeEach(() => {
        const jwtSecret = "secret";
        process.env.JWT_SECRET = jwtSecret;
        const productHandler: SpyObj<ProductHandler> = createSpyObj("ProductHandler", ["initRoutes"]);
        const loginHandler: SpyObj<LoginHandler> = createSpyObj("LoginHandler", ["initRoutes"]);
        const tokenService = new TokenService(userStore);
        const userHandler: UserHandler = new UserHandler(userStore, tokenService)
        const orderHandler: SpyObj<OrderHandler> = createSpyObj("OrderHandler", ["initRoutes"]);

        const authHeaderValue = `Bearer: ${jwt.sign({test: "test"}, jwtSecret)}`;
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

    it('should create a new user', async () => {
        const u: User = {
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
            password: "password"
        };

        userStore.create.and.resolveTo(u);

        await request(underTest).post("/users").set(auth)
            .send(u).expect(200, u);
        expect(userStore.create).toHaveBeenCalledWith(u);
    });

    it('should show a user', async () => {
        const id = 1;
        const u: User = {
            id: 1,
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
        };

        userStore.findOne.and.resolveTo(u);

        await request(underTest).get(`/users/${id}`).set(auth)
            .send(u).expect(200, u);
        expect(userStore.findOne).toHaveBeenCalledWith(id);
    });

    it('should show all users', async () => {
        const u: User[] = [
            {
                id: 1,
                firstName: "firstName",
                lastName: "lastName",
                username: "username",
            }
        ];

        userStore.findAll.and.resolveTo(u);

        await request(underTest).get("/users").set(auth)
            .send(u).expect(200, u);
        expect(userStore.findAll).toHaveBeenCalledWith();
    });
});
