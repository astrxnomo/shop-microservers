import { Response } from "express";
import { AddItemSchema } from "../schemas/cart.schema";
import * as cartService from "../services/cart.service";
import { respond } from "../lib/response";
import { AuthRequest } from "../middleware/auth";

export async function getCart(req: AuthRequest, res: Response) {
    const items = await cartService.getCart(req.userId!);
    respond(res, 200, { items, total: cartService.calcTotal(items) });
}

export async function addItem(req: AuthRequest, res: Response) {
    const parsed = AddItemSchema.safeParse(req.body);
    if (!parsed.success) {
        respond(res, 400, null, parsed.error.message);
        return;
    }
    const items = await cartService.addItem(req.userId!, parsed.data);
    respond(res, 200, items);
}

export async function removeItem(req: AuthRequest, res: Response) {
    const items = await cartService.removeItem(
        req.userId!,
        req.params.productId as string,
    );
    respond(res, 200, items);
}

export async function clearCart(req: AuthRequest, res: Response) {
    await cartService.clearCart(req.userId!);
    respond(res, 200, { cleared: true });
}
