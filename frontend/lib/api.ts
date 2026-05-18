const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
            ...init?.headers,
        },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? "Request failed");
    return json.data as T;
}

export type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    category: string;
};

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
};

export type Cart = { items: CartItem[]; total: number };

export type OrderItem = {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
};
export type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
};

export const api = {
    // Catalog
    getProducts: () => request<Product[]>("/api/catalog/products"),
    getProduct: (id: string) => request<Product>(`/api/catalog/products/${id}`),

    // Cart
    getCart: () => request<Cart>("/api/cart/"),
    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
        request<CartItem[]>("/api/cart/items", {
            method: "POST",
            body: JSON.stringify(item),
        }),
    removeFromCart: (productId: string) =>
        request<CartItem[]>(`/api/cart/items/${productId}`, {
            method: "DELETE",
        }),

    // Orders
    getOrders: () => request<Order[]>("/api/orders/"),
    getOrder: (id: string) => request<Order>(`/api/orders/${id}`),
    placeOrder: () => request<Order>("/api/orders/", { method: "POST" }),

    // Auth
    register: (email: string, password: string) =>
        request<{ token: string; user: { id: string; email: string } }>(
            "/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
            },
        ),
    login: (email: string, password: string) =>
        request<{ token: string; user: { id: string; email: string } }>(
            "/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
            },
        ),
};
