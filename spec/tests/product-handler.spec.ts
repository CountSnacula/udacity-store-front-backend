import {Order, OrderStatus, OrderStore, ProductOrder} from "../../src/db/models/order";
import {OrderHandler} from "../../src/db/handler/order-handler";
import SpyObj = jasmine.SpyObj;
import {Application, Request, Response} from "express";
import createSpyObj = jasmine.createSpyObj;
import exp = require("constants");
import {ProductHandler} from "../../src/db/handler/product-handler";
import {Product, ProductStore} from "../../src/db/models/product";


describe("ProductHandler tests", () => {
    let underTest: ProductHandler;
    const productSpy: SpyObj<ProductStore> = createSpyObj("ProductStore", ["findAll", "findOne", "create"]);

    beforeEach(() => {
        underTest = new ProductHandler(productSpy);

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

        const req: Request = {
            body: p
        } as unknown as Request;

        productSpy.create.and.resolveTo(p);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.create(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(p);
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

        const req: Request = {
            params: {
                id: id
            }
        } as unknown as Request;

        productSpy.findOne.and.resolveTo(p);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.show(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(p);
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

        const req: Request = {} as unknown as Request;

        productSpy.findAll.and.resolveTo(p);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.index(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(p);
        expect(productSpy.findAll).toHaveBeenCalledWith();
    });

    it('should set the correct routes', () => {
        const appSpy = createSpyObj("Application", ["get", "post"])
        const getRouts = ["/products", "/products/:id"];
        appSpy.get.and.callFake((url: string) => {
            expect(getRouts).toContain(url);
        });
        appSpy.post.and.callFake((url: string) => {
            expect(url).toBe("/products");
        });
        underTest.initRoutes(appSpy);
    });
});
