import { Response } from "express";
import * as orderService from "../services/order.service";
import { respond } from "../lib/response";
import { AuthRequest } from "../middleware/auth";

export async function listOrders(req: AuthRequest, res: Response) {
    const orders = await orderService.listOrders(req.userId!);
    respond(res, 200, orders);
}

export async function getOrder(req: AuthRequest, res: Response) {
    const order = await orderService.getOrder(
        req.params.id as string,
        req.userId!,
    );
    respond(res, 200, order);
}

export async function checkout(req: AuthRequest, res: Response) {
    const token = req.headers.authorization!.slice(7);
    const order = await orderService.checkout(req.userId!, token);
    respond(res, 201, order);
}
