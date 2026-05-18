import { Response } from "express";

export function respond(
    res: Response,
    status: number,
    data: unknown,
    error?: string,
) {
    res.status(status).json({
        success: !error,
        data: error ? null : data,
        error: error ?? null,
    });
}
