import { beforeAll, describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { DbService } from "@/database/init";
import { MigrationSequelize, ProductSequelize } from "@/database/models";
import { Routes } from "@/routes/routes";
import ProductSeederExec from "@/features/products/database/seeders/exec/product.seeder.exec";
import productSeederData from "@/features/products/database/seeders/data/product.seeder.data";
import { jsonRequest } from "@tests/helpers/http.helper";

/** Requiere MySQL real: bun run test:integration */
const enabled = Bun.env.RUN_INTEGRATION === 'true';

describe.skipIf(!enabled)('products (integration, MySQL)', () => {
    const app = new Hono().route('/', new Routes().routes);

    beforeAll(async () => {
        await ProductSequelize.drop();
        await MigrationSequelize.drop();
        await DbService();
    });

    const findMigration = (abbreviation: string) => MigrationSequelize.findOne({ where: { abbreviation } });

    it('runs the registered migrations', async () => {
        const migration = await findMigration('ANIP');
        expect(migration?.executed).toBe(true);
    });

    it('runs the products seeder once and upsert keeps it idempotent', async () => {
        const seeder = await findMigration('PRDS');
        expect(seeder?.executed).toBe(true);
        expect(await ProductSequelize.count()).toBe(productSeederData.length);

        await new ProductSeederExec().up();
        expect(await ProductSequelize.count()).toBe(productSeederData.length);

        const laptop = await ProductSequelize.findOne({ where: { sku: 'LAP-001' } });
        expect(laptop?.uuid).toBe(productSeederData[0]?.uuid);
        expect(laptop?.name).toBe('Laptop 14"');
    });

    it('health reports the database up', async () => {
        const body: any = await (await app.request('/')).json();
        expect(body.db.status).toBe(true);
    });

    it('runs the full CRUD flow', async () => {
        const created = await app.request(
            '/api/v1/products',
            jsonRequest('POST', { sku: 'INT-1', name: 'Integration', price: '12.50' }),
        );
        expect(created.status).toBe(201);
        const product: any = await created.json();
        expect(product.price).toBe('12.50');

        const duplicate = await app.request(
            '/api/v1/products',
            jsonRequest('POST', { sku: 'INT-1', name: 'Dup', price: '1.00' }),
        );
        expect(duplicate.status).toBe(409);

        const list: any = await (await app.request('/api/v1/products?name=Integ')).json();
        expect(list.totalItems).toBe(1);

        const updated: any = await (await app.request(
            `/api/v1/products/${product.uuid}`,
            jsonRequest('PATCH', { stock: 4 }),
        )).json();
        expect(updated.stock).toBe(4);

        expect((await app.request(`/api/v1/products/${product.uuid}`, { method: 'DELETE' })).status).toBe(200);
        expect((await app.request(`/api/v1/products/${product.uuid}`)).status).toBe(404);
    });
});
