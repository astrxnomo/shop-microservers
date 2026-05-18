import { createApp } from "./app";
import { config } from "./config";

createApp().listen(config.port, () =>
    console.log(`Orders service running on port ${config.port}`),
);
