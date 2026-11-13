import sequelize from "@/database/sequelize";
import type { Migration } from "@/shared";
import { CustomError } from "@/shared/errors/custom.error";

const TABLE_NAME = 'products';
const INDEX_NAME = 'products_name_idx';

// Migración de ejemplo: idempotente, se puede usar como referencia para futuras migraciones.
export default class AddNameIndexToProducts implements Migration {
    public async up(): Promise<void> {
        try {
            if (await this.indexExists()) {
                console.log(`[migration] ${TABLE_NAME}.${INDEX_NAME} already exists, nothing to do`);
                return;
            }

            await sequelize.getQueryInterface().addIndex(TABLE_NAME, ['name'], { name: INDEX_NAME });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error adding ${TABLE_NAME}.${INDEX_NAME}: ${error}`);
        }
    }

    public async down(): Promise<void> {
        try {
            if (!(await this.indexExists())) {
                console.log(`[migration] ${TABLE_NAME}.${INDEX_NAME} does not exist, nothing to do`);
                return;
            }

            await sequelize.getQueryInterface().removeIndex(TABLE_NAME, INDEX_NAME);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error removing ${TABLE_NAME}.${INDEX_NAME}: ${error}`);
        }
    }

    private async indexExists(): Promise<boolean> {
        const indexes = await sequelize.getQueryInterface().showIndex(TABLE_NAME) as { name: string }[];
        return indexes.some(index => index.name === INDEX_NAME);
    }
}
