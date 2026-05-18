import { redis } from "../lib/redis";
import { CartItem } from "../types/cart";

const TTL_SECONDS = 60 * 60 * 24 * 7;

export async function getCart(sessionId: string): Promise<CartItem[]> {
    const raw = await redis.get(sessionId);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

export async function addItem(
    sessionId: string,
    newItem: CartItem,
): Promise<CartItem[]> {
    const items = await getCart(sessionId);
    const idx = items.findIndex((i) => i.productId === newItem.productId);
    if (idx >= 0) {
        items[idx].quantity += newItem.quantity;
    } else {
        items.push(newItem);
    }
    await redis.set(sessionId, JSON.stringify(items), "EX", TTL_SECONDS);
    return items;
}

export async function removeItem(
    sessionId: string,
    productId: string,
): Promise<CartItem[]> {
    const items = (await getCart(sessionId)).filter(
        (i) => i.productId !== productId,
    );
    await redis.set(sessionId, JSON.stringify(items), "EX", TTL_SECONDS);
    return items;
}

export async function clearCart(sessionId: string): Promise<void> {
    await redis.del(sessionId);
}

export function calcTotal(items: CartItem[]): number {
    return (
        Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) /
        100
    );
}
