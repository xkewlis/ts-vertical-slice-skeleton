import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { ProductSequelize } from "@/features/products/database/Product";
import { buildProductsApp } from "./products.helper";

describe('DELETE /products/:uuid (deleteProduct)', () => {
    afterEach(() => mock.restore());

    it('returns success when deleted', async () => {
        spyOn(ProductSequelize, 'destroy').mockResolvedValue(1);

        const res = await buildProductsApp().request('/abc', { method: 'DELETE' });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ success: true });
    });

    it('returns 404 when nothing was deleted', async () => {
        spyOn(ProductSequelize, 'destroy').mockResolvedValue(0);

        const res = await buildProductsApp().request('/abc', { method: 'DELETE' });

        expect(res.status).toBe(404);
    });
});
