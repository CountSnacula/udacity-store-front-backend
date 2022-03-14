import {Product, ProductStore} from "../models/product";
import {Application, Request, Response} from "express";
import {User, UserStore} from "../models/user";

export class UserHandler {
    private userStore: UserStore;
    constructor(userStore: UserStore) {
        this.userStore = userStore;
    }

    async index(request: Request, response: Response): Promise<void> {
        try {
            const users: User[] = await this.userStore.findAll();
            response.send(users);
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
                message: "No user id present"
            });
        }
        try {
            const users: User = await this.userStore.findOne(parseInt(id));
            response.send(users);
        } catch (e) {
            response.status(500);
            response.send(e);
        }
    }

    async create(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const password = request.body.password;
        const lastName = request.body.lastName;
        const firstName = request.body.firstName;
        try {
            const user: User = {
                username,password,lastName,firstName
            }
            const created: User = await this.userStore.create(user);
            response.send(created);
        } catch (e) {
            response.status(500);
            response.send(e);
        }
    }

    initRoutes(app: Application): void {
        app.get("/users", (req, resp) => this.index(req, resp));
        app.get("/users/:id", (req, resp) => this.show(req, resp));
        app.post("/users", (req, resp) => this.create(req, resp));
    }
}
