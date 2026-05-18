import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../config";

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            data: null,
            error: "Unauthorized",
        });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), config.jwtSecret) as {
            sub: string;
        };
        req.userId = payload.sub;
        next();
    } catch {
        res.status(401).json({
            success: false,
            data: null,
            error: "Invalid token",
        });
    }
}
