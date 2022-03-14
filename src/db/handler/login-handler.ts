import {TokenService} from "../service/token-service";
import {Application, Request, Response} from "express";

export class LoginHandler {
    tokenService: TokenService;

    constructor(tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    async login(request: Request, response: Response): Promise<void> {
        try {
            const authToken = await this.tokenService.createToken(request.body);
            response.send(authToken);
        } catch (e) {
            if (e instanceof Error) {
                response.status(401);
                response.send({
                    message: e.message
                });
                return;
            }
            response.status(500);
            response.send(e);
        }
    }

    initRoutes(app: Application): void {
        app.post("/login", (req, resp) => this.login(req, resp));
    }
}
