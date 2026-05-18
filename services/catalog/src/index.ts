import { createApp } from "./app";
import { config } from "./config";
import { seedIfEmpty } from "./lib/seed";

const app = createApp();
app.listen(config.port, async () => {
    console.log(`Catalog service running on port ${config.port}`);
    try {
        await seedIfEmpty();
    } catch (e) {
        console.error("Seed error:", e);
    }
});
