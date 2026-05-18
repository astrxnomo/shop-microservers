import { prisma } from "../lib/prisma";
import { AppError } from "../lib/AppError";
import * as catalogClient from "../clients/catalog.client";
import * as decrementStock from "../clients/decrementStock";
import * as cartClient from "../clients/cart.client";
import * as fetchCart from "../clients/fetchCart";

export async function listOrders(userId: string) {
    return prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getOrder(id: string, userId: string) {
    const order = await prisma.order.findFirst({
        where: { id, userId },
        include: { items: true },
    });
    if (!order) throw new AppError("Order not found", 404);
    return order;
}

export async function checkout(userId: string, token: string) {
    const cart = await fetchCart.fetchCart(token);
    if (!cart.items.length) throw new AppError("Cart is empty", 400);

    for (const item of cart.items) {
        await decrementStock.decrementStock(item.productId, item.quantity);
    }

    const order = await prisma.order.create({
        data: {
            userId,
            total: cart.total,
            items: {
                create: cart.items.map((i) => ({
                    productId: i.productId,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                })),
            },
        },
        include: { items: true },
    });

    await cartClient.clearCart(token);
    return order;
}
