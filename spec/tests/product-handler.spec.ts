import {OrderHandler} from "../../src/db/handler/order-handler";
import {ProductHandler} from "../../src/db/handler/product-handler";
import {Product, ProductStore} from "../../src/db/models/product";
import {TokenService} from "../../src/db/service/token-service";
import {Server} from "http";
import {LoginHandler} from "../../src/db/handler/login-handler";
import {UserHandler} from "../../src/db/handler/user-handler";
import jwt from "jsonwebtoken";
import {StoreFront} from "../../src/storefront";
import {UserStore} from "../../src/db/models/user";
import request from "supertest";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;


describe("ProductHandler tests", () => {
    let underTest: Server;
    const productSpy: SpyObj<ProductStore> = createSpyObj("ProductStore", ["findAll", "findOne", "create"]);

    let auth: object;

    beforeEach(() => {
        const jwtSecret = "secret";
        process.env.JWT_SECRET = jwtSecret;
        const userStoreSpy: SpyObj<UserStore> = createSpyObj("UserStore", ["findAndValidate"]);
        const loginHandler: SpyObj<LoginHandler> = createSpyObj("LoginHandler", ["initRoutes"]);
        const tokenService = new TokenService(userStoreSpy);
        const userHandler: SpyObj<UserHandler> = createSpyObj("UserHandler", ["initRoutes"]);
        const orderHandler: SpyObj<OrderHandler> = createSpyObj("OrderHandler", ["initRoutes"]);
        const productHandler = new ProductHandler(productSpy, tokenService);

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

    it('should create a new Product', async () => {
        const p: Product = {
            category: "category",
            price: 50,
            name: "name"
        };

        productSpy.create.and.resolveTo(p);

        await request(underTest).post("/products").set(auth)
            .send(p).expect(200, p);
        expect(productSpy.create).toHaveBeenCalledWith(p);
    });

    it('should show a Product', async () => {
        const id = 1;
        const p: Product = {
            id,
            category: "category",
            price: 50,
            name: "name"
        };

        productSpy.findOne.and.resolveTo(p);

        await request(underTest).get(`/products/${id}`).set(auth)
            .expect(200, p);
        expect(productSpy.findOne).toHaveBeenCalledWith(id);
    });

    it('should show all products', async () => {
        const p: Product[] = [
            {
                id: 1,
                category: "category",
                price: 50,
                name: "name"
            }
        ];

        productSpy.findAll.and.resolveTo(p);

        await request(underTest).get("/products").set(auth)
            .expect(200, p);
        expect(productSpy.findAll).toHaveBeenCalledWith();
    });
});
