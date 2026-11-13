import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { CreateProductDto } from "./createProduct.dto";
import { CreateProductUseCase } from "./createProduct.useCase";
import { CustomError } from "@/shared/errors/custom.error";

export class CreateProductController {
    private readonly createProductUseCase: CreateProductUseCase = new CreateProductUseCase();

    public create = async (c: Context) => {
        try {
            let requestBody: CreateProductDto;
            try {
                requestBody = await c.req.json<CreateProductDto>();
            } catch {
                return c.json({ message: 'Request body must be valid JSON' }, 400);
            }

            const [errors, createProductDto] = CreateProductDto.create(requestBody);
            if (!createProductDto) return c.json({ message: errors }, 400);

            const product = await this.createProductUseCase.execute(createProductDto);
            return c.json(product, 201);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError && error.statusCode < 500) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode);
            }
            return c.json({ error: 'Error creating product' }, 500);
        }
    }
}
