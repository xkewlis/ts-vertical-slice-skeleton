import { Hono } from "hono";
import { CreateProductController } from "./createProduct/createProduct.controller";
import { DeleteProductController } from "./deleteProduct/deleteProduct.controller";
import { GetProductController } from "./getProduct/getProduct.controller";
import { ListProductsController } from "./listProducts/listProducts.controller";
import { UpdateProductController } from "./updateProduct/updateProduct.controller";

export class ProductRoutes {
    public get routes(): Hono {
        const routes = new Hono();
        routes.get('/', new ListProductsController().getPaginated);
        routes.post('/', new CreateProductController().create);
        routes.get('/:uuid', new GetProductController().getByUuid);
        routes.patch('/:uuid', new UpdateProductController().update);
        routes.delete('/:uuid', new DeleteProductController().delete);
        return routes;
    }
}
