import { Context } from "hono";
import { DeleteProductUseCase } from "./deleteProduct.useCase";

export class DeleteProductController {
    private readonly deleteProductUseCase: DeleteProductUseCase = new DeleteProductUseCase();

    public delete = async (c: Context) => {
        try {
            const uuid = c.req.param('uuid');
            if (!uuid) return c.json({ message: 'UUID is required' }, 400);

            const deleted = await this.deleteProductUseCase.execute(uuid);
            if (!deleted) return c.json({ message: 'Product not found.' }, 404);
            return c.json({ success: true }, 200);
        } catch (error) {
            console.error(error);
            return c.json({ error: 'Error deleting product' }, 500);
        }
    }
}
