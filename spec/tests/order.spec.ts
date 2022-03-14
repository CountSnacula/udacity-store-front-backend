import {Order, OrderStatus, OrderStore, ProductOrder} from "../../src/db/models/order";
import {Pool, PoolClient, QueryResult} from "pg";
import {User} from "../../src/db/models/user";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;


describe("Order Store tests", () => {
    let underTest: OrderStore;
    const poolSpy: SpyObj<Pool> = createSpyObj("Pool", ["connect"]);
    const poolClientSpy: SpyObj<PoolClient> = createSpyObj("PoolClient", ["release", "query"]);

    beforeEach(() => {
        // @ts-ignore
        poolSpy.connect.and.returnValue(Promise.resolve(poolClientSpy))
        underTest = new OrderStore(poolSpy);

    });

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it('should create a new order', async () => {
        const expectedQuery = "INSERT INTO orders (user_id, status)\n" +
            "                                 VALUES (3, 'active')\n" +
            "                                 RETURNING id, user_id as userId, status";
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

        const queryResult: QueryResult<Order> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [order]
        }
        // @ts-ignore
        poolClientSpy.query.and.returnValue(Promise.resolve(queryResult));
        const actual = await underTest.createOrder(order, userId);
        expect(actual).toBe(order);
        expect(poolClientSpy.release).toHaveBeenCalled();
        // @ts-ignore
        expect(poolClientSpy.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should complete an active order', async () => {
        const expectedQuery = "UPDATE orders\n" +
            "                               SET status= 'complete'\n" +
            "                               WHERE id = 1 AND user_id = 2\n" +
            "                               RETURNING id, user_id as userId, status";
        const id = 1;
        const userId = 2;
        const products: ProductOrder[] = [{
            productId: 2,
            quantity: 5,
        }];
        const status: OrderStatus = OrderStatus.active;
        const order: Order = {
            id,
            products,
            status
        };

        const queryResult: QueryResult<Order> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [order]
        }
        // @ts-ignore
        poolClientSpy.query.and.returnValue(Promise.resolve(queryResult));
        const actual = await underTest.completeOrder(userId, id);
        expect(actual).toBe(order);
        expect(poolClientSpy.release).toHaveBeenCalled();
        // @ts-ignore
        expect(poolClientSpy.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should find an active order', async () => {
        const expectedQuery = "SELECT o.id as id, o.user_id as userId, o.status as status\n" +
            "                         FROM orders o\n" +
            "                                  inner join users u on u.id = o.user_id\n" +
            "                         WHERE o.user_id = 3\n" +
            "                           AND status LIKE 'active'";
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

        const queryResult: QueryResult<Order> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [order]
        }
        // @ts-ignore
        poolClientSpy.query.and.returnValue(Promise.resolve(queryResult));
        const actual = await underTest.findActive(userId);
        expect(actual).toBe(order);
        expect(poolClientSpy.release).toHaveBeenCalled();
        // @ts-ignore
        expect(poolClientSpy.query).toHaveBeenCalledWith(expectedQuery);
    });
});
