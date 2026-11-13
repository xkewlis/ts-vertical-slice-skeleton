import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { ProductSequelize } from "@/features/products/database/Product";
import { buildProductRow, buildProductsApp } from "./products.helper";

describe('GET /products (listProducts)', () => {
    afterEach(() => mock.restore());

    it('returns a paginated list', async () => {
        const findAndCountAll = spyOn(ProductSequelize, 'findAndCountAll').mockResolvedValue({
            rows: [buildProductRow({ uuid: 'a' }), buildProductRow({ uuid: 'b' })],
            count: 12,
        } as any);

        const res = await buildProductsApp().request('/?page=2&itemsPerPage=5');

        expect(res.status).toBe(200);
        const body: any = await res.json();
        expect(body).toMatchObject({ totalItems: 12, page: 2, itemsPerPage: 5, totalPages: 3 });
        expect(body.products).toHaveLength(2);

        const [options] = findAndCountAll.mock.calls[0] as any[];
        expect(options.limit).toBe(5);
        expect(options.offset).toBe(5);
    });

    it('falls back to createdAt when the sorting key is not allowed', async () => {
        const findAndCountAll = spyOn(ProductSequelize, 'findAndCountAll').mockResolvedValue({ rows: [], count: 0 } as any);

        await buildProductsApp().request('/?sortingKey=password&sortingOrder=ASC');

        const [options] = findAndCountAll.mock.calls[0] as any[];
        expect(options.order[0]).toEqual(['createdAt', 'DESC']);
    });

    it('returns 400 when itemsPerPage is above the limit', async () => {
        const res = await buildProductsApp().request('/?itemsPerPage=500');

        expect(res.status).toBe(400);
    });
});
