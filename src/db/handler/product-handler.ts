import {Product, ProductStore} from "../models/product";
import {Application, Request, Response} from "express";

export class ProductHandler {
    private productStore: ProductStore;
    constructor(productStore: ProductStore) {
        this.productStore = productStore;
    }

    async index(request: Request, response: Response): Promise<void> {
        try {
            const products: Product[] = await this.productStore.findAll();
            response.send(products);
        } catch (e) {
            response.status(500);
            response.send(e);
        }
    }

    async show(request: Request, response: Response): Promise<void> {
        const id = request.params.id;
        if (id === undefined) {
            response.status(400);
            response.send({
                message: "No product id present"
            });
        }
        try {
            const product: Product = await this.productStore.findOne(parseInt(id));
            response.send(product);
        } catch (e) {
            response.status(500);
            response.send(e);
        }
    }

    async create(request: Request, response: Response): Promise<void> {
        const category = request.body.category;
        const price = request.body.price;
        const name = request.body.name;
        try {
            const product: Product = {
                category,
                name,
                price: parseInt(price)
            }
            const created: Product = await this.productStore.create(product);
            response.send(created);
        } catch (e) {
            response.status(500);
            response.send(e);
        }
    }

    initRoutes(app: Application): void {
        app.get("/products", (req, resp) => this.index(req, resp));
        app.get("/products/:id", (req, resp) => this.show(req, resp));
        app.post("/products", (req, resp) => this.create(req, resp));
    }
}
