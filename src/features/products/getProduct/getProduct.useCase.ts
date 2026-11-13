import { ProductSequelize } from "../database/Product";
import { ProductEntity } from "../entities";
import { CustomError } from "@/shared/errors/custom.error";

export class GetProductUseCase {
    async execute(uuid: string): Promise<ProductEntity | null> {
        try {
            const row = await ProductSequelize.findOne({ where: { uuid } });
            if (!row) return null;

            return ProductEntity.fromRow(row);
        } catch (error) {
            throw CustomError.internalServer(`Error getting product by uuid: ${error}`);
        }
    }
}
