import { z } from "zod";

export const StockDecrementSchema = z.object({
    decrement: z.number().int().positive(),
});
