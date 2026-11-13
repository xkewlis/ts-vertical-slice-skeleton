import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Op } from "sequelize";
import { ProductSequelize } from "@/features/products/database/Product";
import productSeederData from "@/features/products/database/seeders/data/product.seeder.data";
import ProductSeederExec from "@/features/products/database/seeders/exec/product.seeder.exec";
import { ProductSeederDto } from "@/features/products/database/seeders/productSeeder.dto";
import { CustomError } from "@/shared/errors/custom.error";
import { buildProductRow } from "./products.helper";

describe('ProductSeederExec', () => {
    afterEach(() => mock.restore());

    it('upserts every product of the seeder data', async () => {
        const upsert = spyOn(ProductSequelize, 'upsert').mockResolvedValue([buildProductRow(), null]);

        await new ProductSeederExec().up();

        expect(upsert).toHaveBeenCalledTimes(productSeederData.length);
        expect(upsert.mock.calls[0]?.[0]).toMatchObject({
            uuid: productSeederData[0]?.uuid,
            sku: productSeederData[0]?.sku,
        });
    });

    it('wraps unexpected errors in CustomError', async () => {
        spyOn(ProductSequelize, 'upsert').mockRejectedValue(new Error('db down'));

        const error = await new ProductSeederExec().up().catch(error => error);

        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(500);
    });

    it('down removes only the seeded products', async () => {
        const destroy = spyOn(ProductSequelize, 'destroy').mockResolvedValue(productSeederData.length);

        await new ProductSeederExec().down();

        const [options] = destroy.mock.calls[0] as any[];
        expect(options.force).toBe(true);
        expect(options.where.uuid[Op.in]).toEqual(productSeederData.map(productData => productData.uuid));
    });
});

describe('ProductSeederDto', () => {
    it('requires a valid uuid on top of the product rules', () => {
        const [errors] = ProductSeederDto.create({ uuid: 'nope', sku: 'A-1', name: 'A', price: '1.999' });

        expect(errors).toEqual([
            'Price must be a decimal string with up to 2 decimals, e.g. "19.90"',
            'UUID is invalid',
        ]);
    });

    it('every item of the seeder data is valid', () => {
        for (const productData of productSeederData) {
            const [errors] = ProductSeederDto.create(productData);
            expect(errors).toBeUndefined();
        }
    });
});
