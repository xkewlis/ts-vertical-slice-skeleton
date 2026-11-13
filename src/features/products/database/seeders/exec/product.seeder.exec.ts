import { Op } from "sequelize";
import { ProductSequelize } from "@/features/products/database/Product";
import { ProductEntity } from "@/features/products/entities";
import productSeederData from "../data/product.seeder.data";
import { ProductSeederDto } from "../productSeeder.dto";
import type { Migration } from "@/shared";
import { CustomError } from "@/shared/errors/custom.error";

// Se registra en src/database/seeders/data/migration.seeder.data.ts y MigrationSeederExec
// lo ejecuta una sola vez al arrancar (queda marcado en la tabla migrations).
export default class ProductSeederExec implements Migration {
    public async up(): Promise<void> {
        try {
            for (const productData of productSeederData) {
                const [errors, productSeederDto] = ProductSeederDto.create(productData);
                if (errors) {
                    console.error(`Validation errors: ${errors}`);
                    continue;
                }
                if (productSeederDto) {
                    await this.registerOrUpdate(productSeederDto);
                }
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error executing ProductSeeder: ${error}`);
        }
    }

    public async down(): Promise<void> {
        try {
            await ProductSequelize.destroy({
                where: { uuid: { [Op.in]: productSeederData.map(productData => productData.uuid) } },
                force: true,
            });
        } catch (error) {
            throw CustomError.internalServer(`Error reverting ProductSeeder: ${error}`);
        }
    }

    private async registerOrUpdate(productSeederDto: ProductSeederDto): Promise<ProductEntity> {
        try {
            const [product] = await ProductSequelize.upsert({
            uuid: productSeederDto.uuid,
            sku: productSeederDto.sku,
            name: productSeederDto.name,
            description: productSeederDto.description,
            price: productSeederDto.price,
            stock: productSeederDto.stock,
        });

        return ProductEntity.fromRow(product);
        } catch (error) {
            throw CustomError.internalServer(`Error registering or updating product: ${error}`);
        }
    }
}
