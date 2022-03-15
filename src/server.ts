import {ProductHandler} from "./db/handler/product-handler";
import {DbConnection} from "./db/connection/database";
import {ProductStore} from "./db/models/product";
import {UserHandler} from "./db/handler/user-handler";
import {UserStore} from "./db/models/user";
import {OrderHandler} from "./db/handler/order-handler";
import {OrderStore} from "./db/models/order";
import {TokenService} from "./db/service/token-service";
import {LoginHandler} from "./db/handler/login-handler";
import {StoreFront} from "./storefront";


const con = new DbConnection();

const productStore = new ProductStore(con.getPool())
const userStore = new UserStore(con.getPool())
const orderStore = new OrderStore(con.getPool());
const tokenService = new TokenService(userStore);

const productHandler = new ProductHandler(productStore, tokenService);
const userHandler = new UserHandler(userStore, tokenService);
const orderHandler = new OrderHandler(orderStore, tokenService);
const loginHandler = new LoginHandler(tokenService);

new StoreFront(productHandler, userHandler, orderHandler, loginHandler).startServer();
