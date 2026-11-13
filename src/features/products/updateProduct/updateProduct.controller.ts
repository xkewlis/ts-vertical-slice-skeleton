import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { UpdateProductDto } from "./updateProduct.dto";
import { UpdateProductUseCase } from "./updateProduct.useCase";
import { CustomError } from "@/shared/errors/custom.error";

export class UpdateProductController {
    private readonly updateProductUseCase: UpdateProductUseCase = new UpdateProductUseCase();

    public update = async (c: Context) => {
        try {
            const uuid = c.req.param('uuid');
            if (!uuid) return c.json({ message: 'UUID is required' }, 400);

            let requestBody: UpdateProductDto;
            try {
                requestBody = await c.req.json<UpdateProductDto>();
            } catch {
                return c.json({ message: 'Request body must be valid JSON' }, 400);
            }

            const [errors, updateProductDto] = UpdateProductDto.create(requestBody);
            if (!updateProductDto) return c.json({ message: errors }, 400);

            const product = await this.updateProductUseCase.execute(uuid, updateProductDto);
            if (!product) return c.json({ message: 'Product not found.' }, 404);
            return c.json(product, 200);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError && error.statusCode < 500) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode);
            }
            return c.json({ error: 'Error updating product' }, 500);
        }
    }
}
