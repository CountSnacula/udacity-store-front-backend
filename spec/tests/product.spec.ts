import {Product, ProductStore} from "../../src/db/models/product";
import {Pool, PoolClient, QueryResult} from "pg";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;


describe("Product Store tests", () => {
    let underTest: ProductStore;
    const poolSpy: SpyObj<Pool> = createSpyObj("Pool", ["connect"]);
    const poolClientSpy: SpyObj<PoolClient> = createSpyObj("PoolClient", ["release", "query"]);

    beforeEach(() => {
        // @ts-ignore
        poolSpy.connect.and.returnValue(Promise.resolve(poolClientSpy));
        underTest = new ProductStore(poolSpy);

    });

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it("should find a product", async () => {
        const expectedQuery = "SELECT id, name, price, category\n" +
            "                     FROM products\n" +
            "                     WHERE id = 1";
        const p: Product = {
            id: 1,
            category: "category",
            price: 50,
            name: "name"
        };
        const queryResult: QueryResult<Product> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [p]
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery) => {
            expect(actualQuery).toEqual(expectedQuery);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.findOne(1);
        expect(actual).toBe(p);
        expect(poolClientSpy.release).toHaveBeenCalled();
    });

    it("should find all product", async () => {
        const expectedQuery = "SELECT id, name, price, category\n" +
            "                     FROM products  LIMIT 5 OFFSET 0";
        const products: Product[] = [
            {
                id: 1,
                category: "category",
                price: 50,
                name: "name"
            }
        ];
        const queryResult: QueryResult<Product> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: products
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery) => {
            expect(actualQuery).toEqual(expectedQuery);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.findAll();
        expect(actual).toBe(products);
        expect(poolClientSpy.release).toHaveBeenCalled();
    });

    it("should find all product query for category", async () => {
        const expectedQuery = "SELECT id, name, price, category\n" +
            "                     FROM products  WHERE category LIKE 'category'  LIMIT 5 OFFSET 0";
        const products: Product[] = [
            {
                id: 1,
                category: "category",
                price: 50,
                name: "name"
            }
        ];
        const queryResult: QueryResult<Product> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: products
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery) => {
            expect(actualQuery).toEqual(expectedQuery);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.findAll(undefined, undefined, "category");
        expect(actual).toBe(products);
        expect(poolClientSpy.release).toHaveBeenCalled();
    });
});
