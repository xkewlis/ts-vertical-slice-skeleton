import { Hono } from "hono";
import { ProductRoutes } from "@/features/products/routes";

export class V1Routes {
    public get routes(): Hono {
        const routes = new Hono();
        routes.route("/products", new ProductRoutes().routes);
        return routes;
    }
}
