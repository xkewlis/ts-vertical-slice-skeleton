import { Hono } from "hono";
import { mock } from "bun:test";
import { ProductRoutes } from "@/features/products/routes";
import { ProductSequelize } from "@/features/products/database/Product";

const now = new Date('2026-01-01T00:00:00.000Z');

/** App con las rutas reales del feature, sin prefijo: `app.request('/')` llega a ProductRoutes. */
export const buildProductsApp = (): Hono => new Hono().route('/', new ProductRoutes().routes);

/** Fila falsa de ProductSequelize con los atributos y métodos de instancia que usan los use cases. */
export const buildProductRow = (overrides: Partial<ProductSequelize> = {}): ProductSequelize => {
    const attributes = {
        id: 1,
        uuid: '11111111-1111-1111-1111-111111111111',
        sku: 'SKU-001',
        name: 'Product',
        description: null,
        price: '10.00',
        stock: 5,
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
    return {
        ...attributes,
        update: mock(async (values: Partial<ProductSequelize>) => buildProductRow({ ...attributes, ...values })),
    } as unknown as ProductSequelize;
};
