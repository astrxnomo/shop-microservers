import { createApp } from "./app";
import { config } from "./config";

createApp().listen(config.port, () =>
    console.log(`Auth service running on port ${config.port}`),
);
