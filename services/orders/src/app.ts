import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth";
import ordersRouter from "./routes/orders";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/health", (_req, res) =>
        res.json({ status: "ok", service: "orders" }),
    );
    app.use("/", requireAuth, ordersRouter);
    app.use(errorHandler);
    return app;
}
