import { Context } from "hono";
import { ProductPaginationDto } from "./productPagination.dto";
import { ListProductsUseCase } from "./listProducts.useCase";

export class ListProductsController {
    private readonly listProductsUseCase: ListProductsUseCase = new ListProductsUseCase();

    public getPaginated = async (c: Context) => {
        try {
            const [error, paginationDto] = ProductPaginationDto.create(c.req.query());
            if (error || !paginationDto) return c.json({ message: error }, 400);

            const result = await this.listProductsUseCase.execute(paginationDto);
            return c.json({
                totalItems: result.totalItems,
                page: paginationDto.page,
                itemsPerPage: paginationDto.itemsPerPage,
                totalPages: Math.ceil(result.totalItems / paginationDto.itemsPerPage),
                products: result.products,
            }, 200);
        } catch (error) {
            console.error(error);
            return c.json({ error: 'Error getting products' }, 500);
        }
    }
}
