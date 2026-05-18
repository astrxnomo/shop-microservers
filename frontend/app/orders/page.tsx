"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { api, type Order } from "@/lib/api";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
    PENDING: "warning",
    CONFIRMED: "info",
    SHIPPED: "purple",
    DELIVERED: "success",
    CANCELLED: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
            return;
        }
        api.getOrders()
            .then(setOrders)
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-muted-foreground">Cargando pedidos…</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <Package className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Sin pedidos aún</h2>
                <p className="text-muted-foreground">
                    Tu historial de pedidos aparecerá aquí
                </p>
                <Button asChild>
                    <Link href="/">Ir a comprar</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Mis Pedidos</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-mono text-muted-foreground">
                                    #{order.id.slice(-8).toUpperCase()}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString("es-CO", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    STATUS_VARIANT[order.status] ?? "secondary"
                                }
                            >
                                {STATUS_LABEL[order.status] ?? order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="divide-y rounded-md border">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between px-4 py-2 text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.name}{" "}
                                            <span className="text-foreground font-medium">
                                                × {item.quantity}
                                            </span>
                                        </span>
                                        <span className="font-medium">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-sm text-muted-foreground">
                                    Total
                                </span>
                                <span className="font-bold text-lg">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
