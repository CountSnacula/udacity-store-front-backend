import express from "express";
import {ProductHandler} from "./db/handler/product-handler";
import {UserHandler} from "./db/handler/user-handler";
import {OrderHandler} from "./db/handler/order-handler";
import {LoginHandler} from "./db/handler/login-handler";
import bodyParser from "body-parser";
import {Server} from "http";

export class StoreFront {
    private productHandler;
    private userHandler;
    private orderHandler;
    private loginHandler;
    private readonly app = express();

    constructor(productHandler: ProductHandler,
                userHandler: UserHandler,
                orderHandler: OrderHandler,
                loginHandler: LoginHandler) {
        this.orderHandler = orderHandler;
        this.loginHandler = loginHandler;
        this.productHandler = productHandler;
        this.userHandler = userHandler;
    }

    private configureExpressApp(): void {
        this.app.use(bodyParser.json());
        this.loginHandler.initRoutes(this.app);
        this.productHandler.initRoutes(this.app);
        this.userHandler.initRoutes(this.app);
        this.orderHandler.initRoutes(this.app);
    }

    public startServer(): Server {
        this.configureExpressApp();
        return this.app.listen(3000, function () {
            console.log(`starting app on: 127.0.0.1:3000`)
        });
    }
}
