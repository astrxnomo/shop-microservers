import { z } from "zod";

export const AddItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    imageUrl: z.string().url(),
    quantity: z.number().int().positive().default(1),
});

export type AddItemInput = z.infer<typeof AddItemSchema>;
