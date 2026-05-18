"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type Product } from "@/lib/api";

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Record<string, string>>({});

    useEffect(() => {
        api.getProducts()
            .then(setProducts)
            .catch(() => setError("Error al cargar los productos"))
            .finally(() => setLoading(false));
    }, []);

    async function agregarAlCarrito(product: Product) {
        const token = localStorage.getItem("token");
        if (!token) {
            setFeedback((f) => ({
                ...f,
                [product.id]: "Inicia sesión primero",
            }));
            setTimeout(
                () =>
                    setFeedback((f) => {
                        const n = { ...f };
                        delete n[product.id];
                        return n;
                    }),
                2000,
            );
            return;
        }
        setAddingId(product.id);
        try {
            await api.addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
            });
            setFeedback((f) => ({ ...f, [product.id]: "¡Agregado!" }));
            setTimeout(
                () =>
                    setFeedback((f) => {
                        const n = { ...f };
                        delete n[product.id];
                        return n;
                    }),
                1500,
            );
        } catch {
            setFeedback((f) => ({ ...f, [product.id]: "Error" }));
            setTimeout(
                () =>
                    setFeedback((f) => {
                        const n = { ...f };
                        delete n[product.id];
                        return n;
                    }),
                2000,
            );
        } finally {
            setAddingId(null);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                            <div className="aspect-square bg-muted" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-3 w-16 bg-muted rounded" />
                                <div className="h-4 w-3/4 bg-muted rounded" />
                                <div className="h-4 w-1/4 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <PackageX className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className="overflow-hidden flex flex-col"
                    >
                        <div className="relative aspect-square bg-muted overflow-hidden">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        <CardContent className="p-4 flex-1 space-y-2">
                            <Badge variant="secondary" className="text-xs">
                                {product.category}
                            </Badge>
                            <h2 className="font-semibold leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-lg font-bold">
                                ${product.price.toFixed(2)}
                            </p>
                            <p
                                className={`text-xs ${product.stock === 0 ? "text-destructive" : product.stock < 10 ? "text-yellow-600" : "text-muted-foreground"}`}
                            >
                                {product.stock === 0
                                    ? "Sin stock"
                                    : `${product.stock} disponibles`}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button
                                className="w-full"
                                size="sm"
                                disabled={
                                    product.stock === 0 ||
                                    addingId === product.id
                                }
                                onClick={() => agregarAlCarrito(product)}
                                variant={
                                    feedback[product.id] === "¡Agregado!"
                                        ? "secondary"
                                        : "default"
                                }
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                {feedback[product.id] ??
                                    (addingId === product.id
                                        ? "Agregando…"
                                        : "Agregar al carrito")}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
