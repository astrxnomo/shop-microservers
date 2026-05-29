import { config } from "../config";
import { AppError } from "../lib/AppError";

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
};

export type CartData = { items: CartItem[]; total: number };
type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    error: string | null;
};

export async function fetchCart(token: string): Promise<CartData> {
    const res = await fetch(`${config.cartUrl}/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new AppError("Failed to fetch cart", 502);

    const payload = (await res.json()) as ApiResponse<CartData>;
    if (!payload.success || !payload.data) {
        throw new AppError(payload.error ?? "Invalid cart response", 502);
    }

    return payload.data;
}
export async function clearCart(token: string): Promise<void> {
    const res = await fetch(`${config.cartUrl}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new AppError("Failed to clear cart", 502);
}
