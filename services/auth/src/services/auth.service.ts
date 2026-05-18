import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { AppError } from "../lib/AppError";

export async function register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    return {
        token: issueToken(user.id, user.email),
        user: { id: user.id, email: user.email },
    };
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        throw new AppError("Invalid credentials", 401);

    return {
        token: issueToken(user.id, user.email),
        user: { id: user.id, email: user.email },
    };
}

function issueToken(sub: string, email: string) {
    return jwt.sign({ sub, email }, config.jwtSecret, { expiresIn: "7d" });
}
