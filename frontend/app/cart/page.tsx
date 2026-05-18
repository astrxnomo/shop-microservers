"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { api, type Cart } from "@/lib/api";

export default function CarritoPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
            return;
        }
        api.getCart()
            .then(setCart)
            .finally(() => setLoading(false));
    }, [router]);

    async function eliminarItem(productId: string) {
        setRemovingId(productId);
        try {
            const items = await api.removeFromCart(productId);
            setCart((c) =>
                c
                    ? {
                          ...c,
                          items,
                          total: items.reduce(
                              (s, i) => s + i.price * i.quantity,
                              0,
                          ),
                      }
                    : c,
            );
        } finally {
            setRemovingId(null);
        }
    }

    async function realizarPedido() {
        setPlacingOrder(true);
        try {
            await api.placeOrder();
            router.push("/orders");
        } catch (err: unknown) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Error al realizar el pedido",
            );
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-muted-foreground">Cargando carrito…</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
                <p className="text-muted-foreground">
                    Agrega productos para comenzar
                </p>
                <Button asChild>
                    <Link href="/">Ver productos</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium text-muted-foreground">
                        {cart.items.length}{" "}
                        {cart.items.length === 1 ? "producto" : "productos"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="divide-y p-0">
                    {cart.items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center gap-4 px-6 py-4"
                        >
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                    {item.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Cant: {item.quantity} × $
                                    {item.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => eliminarItem(item.productId)}
                                disabled={removingId === item.productId}
                                className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">
                            ${cart.total.toFixed(2)}
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={realizarPedido}
                        disabled={placingOrder}
                        className="flex items-center gap-2"
                    >
                        {placingOrder ? "Procesando…" : "Realizar pedido"}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
