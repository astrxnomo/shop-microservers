"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                setEmail(JSON.parse(user).email);
            } catch {
                /* ignorar */
            }
        }
    }, []);

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setEmail(null);
        router.push("/login");
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl tracking-tight"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Shop
                </Link>

                <nav className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">Catálogo</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href="/cart"
                            className="flex items-center gap-1.5"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Carrito
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href="/orders"
                            className="flex items-center gap-1.5"
                        >
                            <Package className="h-4 w-4" />
                            Pedidos
                        </Link>
                    </Button>
                </nav>

                <div className="flex items-center gap-2">
                    {email ? (
                        <>
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cerrarSesion}
                                className="flex items-center gap-1.5"
                            >
                                <LogOut className="h-4 w-4" />
                                Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Ingresar</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Registrarse</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
