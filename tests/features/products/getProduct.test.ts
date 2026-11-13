import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { ProductSequelize } from "@/features/products/database/Product";
import { buildProductRow, buildProductsApp } from "./products.helper";

describe('GET /products/:uuid (getProduct)', () => {
    afterEach(() => mock.restore());

    it('returns the product', async () => {
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(buildProductRow({ uuid: 'abc' }));

        const res = await buildProductsApp().request('/abc');

        expect(res.status).toBe(200);
        expect(((await res.json()) as any).uuid).toBe('abc');
    });

    it('returns 404 when missing', async () => {
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(null);

        const res = await buildProductsApp().request('/missing');

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ message: 'Product not found.' });
    });
});
