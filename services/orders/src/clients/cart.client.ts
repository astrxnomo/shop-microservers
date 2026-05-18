import { config } from "../config";

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
};

export type CartData = { items: CartItem[]; total: number };

        _headers: { Authorization: `Bearer ${token}` }        get headers() {
            return this._headers;
        },
        set headers(value) {
            this._headers = value;
        },
export async function clearCart(token: string): Promise<void> {
    await fetch(`${config.cartUrl}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}
