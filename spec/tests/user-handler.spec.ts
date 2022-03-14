import {Application, Request, Response} from "express";
import {UserHandler} from "../../src/db/handler/user-handler";
import {User, UserStore} from "../../src/db/models/user";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;


describe("UserHandler tests", () => {
    let underTest: UserHandler;
    const userStore: SpyObj<UserStore> = createSpyObj("UserStore", ["findAll", "findOne", "create"]);

    beforeEach(() => {
        underTest = new UserHandler(userStore);

    });

    it('should have been initialized', () => {
        expect(underTest).toBeTruthy();
    });

    it('should create a new user', async () => {
        const u: User = {
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
            password: "password"
        };

        const req: Request = {
            body: u
        } as unknown as Request;

        userStore.create.and.resolveTo(u);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.create(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(u);
        expect(userStore.create).toHaveBeenCalledWith(u);
    });

    it('should show a user', async () => {
        const id = 1;
        const u: User = {
            id: 1,
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
        };

        const req: Request = {
            params: {
                id: id
            }
        } as unknown as Request;

        userStore.findOne.and.resolveTo(u);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.show(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(u);
        expect(userStore.findOne).toHaveBeenCalledWith(id);
    });

    it('should show all users', async () => {
        const u: User[] = [
            {
                id: 1,
                firstName: "firstName",
                lastName: "lastName",
                username: "username",
            }
        ];

        const req: Request = {} as unknown as Request;

        userStore.findAll.and.resolveTo(u);

        const respSpy = createSpyObj("Response", ["status", "send"]);

        await underTest.index(req, respSpy);
        expect(respSpy.send).toHaveBeenCalledWith(u);
        expect(userStore.findAll).toHaveBeenCalledWith();
    });

    it('should set the correct routes', () => {
        const appSpy = createSpyObj("Application", ["get", "post"])
        const getRouts = ["/users", "/users/:id"];
        appSpy.get.and.callFake((url: string) => {
            expect(getRouts).toContain(url);
        });
        appSpy.post.and.callFake((url: string) => {
            expect(url).toBe("/users");
        });
        underTest.initRoutes(appSpy);
    });
});
