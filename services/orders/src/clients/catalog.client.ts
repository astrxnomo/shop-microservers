import { config } from "../config";
import { AppError } from "../lib/AppError";

export async function decrementStock(
    productId: string,
    quantity: number,
): Promise<void> {
    const res = await fetch(
        `${config.catalogUrl}/products/${productId}/stock`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decrement: quantity }),
        },
    );
    if (!res.ok) throw new AppError(`Failed to decrement stock for ${productId}`, 502);
}
