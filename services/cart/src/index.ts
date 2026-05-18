import { createApp } from "./app";
import { config } from "./config";

createApp().listen(config.port, () =>
    console.log(`Cart service running on port ${config.port}`),
);
