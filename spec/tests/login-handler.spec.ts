import {Auth, Login, TokenService} from "../../src/db/service/token-service";
import {Server} from "http";
import request from 'supertest';
import {ProductHandler} from "../../src/db/handler/product-handler";
import {UserHandler} from "../../src/db/handler/user-handler";
import {LoginHandler} from "../../src/db/handler/login-handler";
import {OrderHandler} from "../../src/db/handler/order-handler";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {StoreFront} from "../../src/storefront";


describe("LoginHandler tests", () => {
    let underTest: Server;
    const productHandler: SpyObj<ProductHandler> = createSpyObj("ProductHandler", ["initRoutes"]);
    const userHandler: SpyObj<UserHandler> = createSpyObj("UserHandler", ["initRoutes"]);
    const orderHandler: SpyObj<OrderHandler> = createSpyObj("OrderHandler", ["initRoutes"]);
    const tokenSpy: SpyObj<TokenService> = createSpyObj("TokenService", ["createToken"]);

    beforeEach(() => {
        const loginHandler = new LoginHandler(tokenSpy);
        underTest = new StoreFront(productHandler,
            userHandler,
            orderHandler,
            loginHandler).startServer();
    });

    afterEach(() => {
        underTest.close()
    })

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it('should login successfully', async () => {
        const l: Login = {
            username: "username",
            password: "password"
        };

        const token: Auth = {
            token: "token"
        };
        tokenSpy.createToken.and.resolveTo(token);

        // await underTest.login(req, respSpy);

        await request(underTest).post("/login").send(l).expect(200, token);

    });
});
