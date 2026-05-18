import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/health", (_req, res) =>
        res.json({ status: "ok", service: "catalog" }),
    );
    app.use("/products", productsRouter);
    app.use(errorHandler);
    return app;
}
