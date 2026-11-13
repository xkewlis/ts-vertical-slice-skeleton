import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { ProductSequelize } from "@/features/products/database/Product";
import { buildProductRow, buildProductsApp } from "./products.helper";
import { jsonRequest } from "@tests/helpers/http.helper";

describe('PATCH /products/:uuid (updateProduct)', () => {
    afterEach(() => mock.restore());

    it('updates only the given fields', async () => {
        const row = buildProductRow({ uuid: 'abc', name: 'Old' });
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(row);

        const res = await buildProductsApp().request('/abc', jsonRequest('PATCH', { name: 'New', stock: 9 }));

        expect(res.status).toBe(200);
        expect(await res.json()).toMatchObject({ uuid: 'abc', name: 'New', stock: 9 });
        expect(row.update).toHaveBeenCalledWith({ name: 'New', stock: 9 });
    });

    it('returns 404 when missing', async () => {
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(null);

        const res = await buildProductsApp().request('/abc', jsonRequest('PATCH', { name: 'New' }));

        expect(res.status).toBe(404);
    });

    it('returns 409 when the new sku is taken', async () => {
        spyOn(ProductSequelize, 'findOne')
            .mockResolvedValueOnce(buildProductRow({ id: 1, uuid: 'abc', sku: 'A-1' }))
            .mockResolvedValueOnce(buildProductRow({ id: 2, sku: 'B-2' }));
        spyOn(console, 'error').mockImplementation(() => {});

        const res = await buildProductsApp().request('/abc', jsonRequest('PATCH', { sku: 'B-2' }));

        expect(res.status).toBe(409);
    });

    it('returns 400 for an empty body', async () => {
        const res = await buildProductsApp().request('/abc', jsonRequest('PATCH', {}));

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ message: ['At least one field is required'] });
    });
});
