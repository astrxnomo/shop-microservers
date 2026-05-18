import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError";
import { respond } from "../lib/response";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    const status = err instanceof AppError ? err.status : 500;
    if (status >= 500) console.error(err);
    respond(
        res,
        status,
        null,
        status < 500 ? err.message : "Internal server error",
    );
}
