import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import {ProductHandler} from "./db/handler/product-handler";
import {DbConnection} from "./db/connection/database";
import {ProductStore} from "./db/models/product";
import {UserHandler} from "./db/handler/user-handler";
import {UserStore} from "./db/models/user";
import {OrderHandler} from "./db/handler/order-handler";
import {OrderStore} from "./db/models/order";
import {TokenService} from "./db/service/token-service";
import {LoginHandler} from "./db/handler/login-handler";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
});

const con = new DbConnection();

const productStore = new ProductStore(con.getPool())
const userStore = new UserStore(con.getPool())
const orderStore = new OrderStore(con.getPool());
const tokenService = new TokenService(userStore);

const productHandler = new ProductHandler(productStore, tokenService);
const userHandler = new UserHandler(userStore, tokenService);
const orderHandler = new OrderHandler(orderStore, tokenService);
const loginHandler = new LoginHandler(tokenService);

loginHandler.initRoutes(app);
productHandler.initRoutes(app);
userHandler.initRoutes(app);
orderHandler.initRoutes(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
});
