import { prisma } from "../lib/prisma";
import { AppError } from "../lib/AppError";

export async function listProducts() {
    return prisma.product.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError("Product not found", 404);
    return product;
}

export async function decrementStock(id: string, decrement: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError("Product not found", 404);
    if (product.stock < decrement)
        throw new AppError("Insufficient stock", 409);
    return prisma.product.update({
        where: { id },
        data: { stock: { decrement } },
    });
}
