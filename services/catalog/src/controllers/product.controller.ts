import { Request, Response } from "express";
import { StockDecrementSchema } from "../schemas/product.schema";
import * as productService from "../services/product.service";
import { respond } from "../lib/response";

export async function listProducts(_req: Request, res: Response) {
    const products = await productService.listProducts();
    respond(res, 200, products);
}

export async function getProduct(req: Request, res: Response) {
    const product = await productService.getProduct(req.params.id as string);
    respond(res, 200, product);
}

export async function updateStock(req: Request, res: Response) {
    const parsed = StockDecrementSchema.safeParse(req.body);
    if (!parsed.success) {
        respond(res, 400, null, parsed.error.message);
        return;
    }
    const product = await productService.decrementStock(
        req.params.id as string,
        parsed.data.decrement,
    );
    respond(res, 200, product);
}
