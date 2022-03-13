import {Pool, PoolClient, QueryResult} from "pg";
import {User, UserStore} from "../../src/db/models/user";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;


describe("User Store tests", () => {
    let underTest: UserStore;
    const poolSpy: SpyObj<Pool> = createSpyObj("Pool", ["connect"]);
    const poolClientSpy: SpyObj<PoolClient> = createSpyObj("PoolClient", ["release", "query"]);
    const bcryptPassword = "test";
    const salt = 3;

    beforeEach(() => {
        process.env.BCRYPT_PASSWORD = bcryptPassword;
        process.env.SALT_ROUNDS = salt.toString();
        // @ts-ignore
        poolSpy.connect.and.returnValue(Promise.resolve(poolClientSpy));
        underTest = new UserStore(poolSpy);

    });

    afterEach(() => {
        delete process.env.BCRYPT_PASSWORD;
        delete process.env.SALT_ROUNDS;
    });

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it("should find a user", async () => {
        const expectedQuery = "SELECT id, firstname, lastname, username\n" +
            "                         FROM users\n" +
            "                         WHERE id = 1";
        const user: User = {
            id: 1,
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
        };
        const queryResult: QueryResult<User> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [user]
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery) => {
            expect(actualQuery).toEqual(expectedQuery);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.findOne(1);
        expect(actual).toBe(user);
        expect(actual.password).toBeFalsy();
        expect(poolClientSpy.release).toHaveBeenCalled();
    });

    it("should find all user", async () => {
        const expectedQuery = "SELECT id, firstname, lastname, username\n" +
            "                         FROM users\n" +
            "                         LIMIT 5 OFFSET 0";
        const user: User[] = [
            {
                id: 1,
                firstName: "firstName",
                lastName: "lastName",
                username: "username",
            }
        ];
        const queryResult: QueryResult<User> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: user
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery) => {
            expect(actualQuery).toEqual(expectedQuery);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.findAll();
        expect(actual).toBe(user);
        expect(actual[0].password).toBeFalsy();
        expect(poolClientSpy.release).toHaveBeenCalled();
    });

    it("should create a user", async () => {
        const expectedQuery = "INSERT INTO users(firstname, lastname, password, username)\n" +
            "                         VALUES (?, ?, ?, ?)\n" +
            "                         RETURNING id, firstname, lastname, username";
        const password = "password";
        const firstName = "firstName";
        const lastName = "lastName";
        const username = "username";
        const userToCreate: User = {
            password,
            firstName,
            lastName,
            username,
        };
        const queryResult: QueryResult<User> = {
            command: "", fields: [], oid: 0, rowCount: 1,
            rows: [userToCreate]
        }
        // @ts-ignore
        poolClientSpy.query.and.callFake((actualQuery, parameters) => {
            expect(actualQuery).toEqual(expectedQuery);
            expect(parameters).toContain(username);
            expect(parameters).toContain(firstName);
            expect(parameters).toContain(lastName);
            expect(parameters).not.toContain(password);
            return Promise.resolve(queryResult);
        })
        const actual = await underTest.create(userToCreate);
        expect(actual).toBe(userToCreate);
        expect(poolClientSpy.release).toHaveBeenCalled();
    });
});
