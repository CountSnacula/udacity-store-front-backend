import {UserStore} from "../models/user";
import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

export type Login = {
    username: string,
    password: string,
}

export type Auth = {
  token: string,
};

export class TokenService {
    jwtSecret: string;
    userStore: UserStore;

    constructor(userStore: UserStore) {
        const secret = process.env.JWT_SECRET;
        if (secret === undefined) {
            throw new Error("JWT_SECRET is not set");
        }
        this.jwtSecret = secret;
        this.userStore = userStore;
    }

    async createToken(login: Login): Promise<Auth> {
        const user = await this.userStore.findAndValidate(login.username, login.password);
        const token = jwt.sign({user}, this.jwtSecret);
        return {
            token
        };
    }

    validateToken(req: Request, resp: Response, next: NextFunction): void {
        try {
            const authorizationHeader = req.headers.authorization || "fallback";
            const token = authorizationHeader.split(' ')[1];
            jwt.verify(token, this.jwtSecret);
            next();
        } catch (e) {
            resp.status(401);
            resp.send({
                message: "Unauthorized"
            });
        }
    }
}
