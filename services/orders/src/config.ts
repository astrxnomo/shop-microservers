export const config = {
    port: parseInt(process.env.PORT ?? "3003", 10),
    catalogUrl: process.env.CATALOG_URL ?? "http://catalog:3001",
    cartUrl: process.env.CART_URL ?? "http://cart:3002",
    jwtSecret: process.env.JWT_SECRET ?? "supersecret",
};
