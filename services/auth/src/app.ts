import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/health", (_req, res) =>
        res.json({ status: "ok", service: "auth" }),
    );
    app.use("/", authRouter);
    app.use(errorHandler);
    return app;
}
