import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { ProductSequelize } from "@/features/products/database/Product";
import { buildProductRow, buildProductsApp } from "./products.helper";
import { jsonRequest } from "@tests/helpers/http.helper";

describe('POST /products (createProduct)', () => {
    const validBody = { sku: 'ABC-1', name: 'Widget', price: '19.90', stock: 3 };

    afterEach(() => mock.restore());

    it('creates a product and returns 201', async () => {
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(null);
        const create = spyOn(ProductSequelize, 'create').mockImplementation(
            (async (values: any) => buildProductRow(values)) as any,
        );

        const res = await buildProductsApp().request('/', jsonRequest('POST', validBody));

        expect(res.status).toBe(201);
        const body: any = await res.json();
        expect(body).toMatchObject({ sku: 'ABC-1', name: 'Widget', price: '19.90', stock: 3 });
        expect(body.uuid).toBeString();
        expect(create).toHaveBeenCalledTimes(1);
    });


    it('returns 409 when the sku already exists', async () => {
        spyOn(console, 'error').mockImplementation(() => {});
        spyOn(ProductSequelize, 'findOne').mockResolvedValue(buildProductRow({ sku: 'ABC-1' }));
        const create = spyOn(ProductSequelize, 'create');

        const res = await buildProductsApp().request('/', jsonRequest('POST', validBody));

        expect(res.status).toBe(409);
        expect(create).not.toHaveBeenCalled();
    });

    it('returns 400 with the DTO errors', async () => {
        const res = await buildProductsApp().request('/', jsonRequest('POST', { ...validBody, price: '1.999', sku: '' }));

        expect(res.status).toBe(400);
        const body: any = await res.json();
        expect(body.message).toEqual([
            'SKU is required',
            'Price must be a decimal string with up to 2 decimals, e.g. "19.90"',
        ]);
    });

    it('returns 400 when the body is not JSON', async () => {
        const res = await buildProductsApp().request('/', { method: 'POST', body: 'nope' });

        expect(res.status).toBe(400);
    });

    it('returns 500 without leaking internal details', async () => {
        spyOn(console, 'error').mockImplementation(() => {});
        spyOn(ProductSequelize, 'findOne').mockRejectedValue(new Error('secret db detail'));

        const res = await buildProductsApp().request('/', jsonRequest('POST', validBody));

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: 'Error creating product' });
    });
});
