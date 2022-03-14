import {Login, TokenService} from "../../src/db/service/token-service";
import {User, UserStore} from "../../src/db/models/user";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {Request} from "express";
import createSpy = jasmine.createSpy;

describe("TokenService tests",  () => {

    let underTest: TokenService;
    const userStore: SpyObj<UserStore> = createSpyObj("UserStore", ["findAndValidate"]);

    beforeEach(() => {
        process.env.JWT_SECRET = "secret";
        underTest = new TokenService(userStore);
    })

    it('should be created', () => {
        expect(underTest).toBeTruthy();
    });

    it('should create and validate a token.', async () => {
        const username = "username";
        const password = "password"
        const u: User = {
            firstName: "firstName",
            lastName: "lastName",
            username, password
        };

        const login: Login = {
            username, password
        }

        userStore.findAndValidate.and.resolveTo(u);

        const token = await underTest.createToken(login);
        expect(token).toBeTruthy();
        expect(userStore.findAndValidate).toHaveBeenCalledWith(username, password);

        const req: Request = {
            headers: {
                authorization: `Bearer: ${token.token}`
            }
        } as unknown as Request;
        const respSpy = createSpyObj("Response", ["status", "send"]);
        const nextSpy = createSpy("NextFunction");
        underTest.validateToken(req, respSpy, nextSpy);
    });
});
