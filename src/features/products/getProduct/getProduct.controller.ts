import { Context } from "hono";
import { GetProductUseCase } from "./getProduct.useCase";

export class GetProductController {
    private readonly getProductUseCase: GetProductUseCase = new GetProductUseCase();

    public getByUuid = async (c: Context) => {
        try {
            const uuid = c.req.param('uuid');
            if (!uuid) return c.json({ message: 'UUID is required' }, 400);

            const product = await this.getProductUseCase.execute(uuid);
            if (!product) return c.json({ message: 'Product not found.' }, 404);
            return c.json(product, 200);
        } catch (error) {
            console.error(error);
            return c.json({ error: 'Error getting product' }, 500);
        }
    }
}
