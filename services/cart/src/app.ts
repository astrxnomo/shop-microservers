import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth";
import cartRouter from "./routes/cart";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/health", (_req, res) =>
        res.json({ status: "ok", service: "cart" }),
    );
    app.use("/", requireAuth, cartRouter);
    app.use(errorHandler);
    return app;
}
