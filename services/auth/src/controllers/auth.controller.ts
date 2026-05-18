import { Request, Response } from "express";
import { AuthSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";
import { respond } from "../lib/response";

export async function register(req: Request, res: Response) {
    const parsed = AuthSchema.safeParse(req.body);
    if (!parsed.success) {
        respond(res, 400, null, parsed.error.message);
        return;
    }
    const result = await authService.register(
        parsed.data.email,
        parsed.data.password,
    );
    respond(res, 201, result);
}

export async function login(req: Request, res: Response) {
    const parsed = AuthSchema.safeParse(req.body);
    if (!parsed.success) {
        respond(res, 400, null, parsed.error.message);
        return;
    }
    const result = await authService.login(
        parsed.data.email,
        parsed.data.password,
    );
    respond(res, 200, result);
}
