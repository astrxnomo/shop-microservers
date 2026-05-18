import { prisma } from "./prisma";

const PRODUCTOS = [
    {
        name: "Auriculares Inalámbricos Pro",
        price: 89.99,
        imageUrl:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        stock: 50,
        category: "Electrónica",
    },
    {
        name: "Teclado Mecánico RGB",
        price: 129.99,
        imageUrl:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        stock: 30,
        category: "Electrónica",
    },
    {
        name: "Hub USB-C 7 en 1",
        price: 49.99,
        imageUrl:
            "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400",
        stock: 75,
        category: "Electrónica",
    },
    {
        name: "Zapatillas de Correr X200",
        price: 119.99,
        imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        stock: 40,
        category: "Calzado",
    },
    {
        name: "Billetera de Cuero Slim",
        price: 34.99,
        imageUrl:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        stock: 100,
        category: "Accesorios",
    },
    {
        name: "Botella Térmica Acero Inox",
        price: 24.99,
        imageUrl:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        stock: 200,
        category: "Hogar y Cocina",
    },
    {
        name: "Tapete de Yoga Antideslizante",
        price: 39.99,
        imageUrl:
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
        stock: 60,
        category: "Deportes",
    },
    {
        name: "Molino de Café Eléctrico",
        price: 64.99,
        imageUrl:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        stock: 25,
        category: "Hogar y Cocina",
    },
    {
        name: "Mochila 30L Impermeable",
        price: 74.99,
        imageUrl:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        stock: 45,
        category: "Accesorios",
    },
    {
        name: "Reloj Inteligente Serie 5",
        price: 199.99,
        imageUrl:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stock: 20,
        category: "Electrónica",
    },
    {
        name: "Lámpara LED de Escritorio",
        price: 44.99,
        imageUrl:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        stock: 80,
        category: "Hogar y Cocina",
    },
    {
        name: "Base de Carga Inalámbrica",
        price: 29.99,
        imageUrl:
            "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=400",
        stock: 90,
        category: "Electrónica",
    },
];

export async function seedIfEmpty() {
    const count = await prisma.product.count();
    if (count > 0) return;
    await prisma.product.createMany({ data: PRODUCTOS });
    console.log(`${PRODUCTOS.length} productos creados.`);
}
