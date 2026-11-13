import { Op, UniqueConstraintError } from "sequelize";
import { ProductSequelize } from "../database/Product";
import { ProductEntity } from "../entities";
import { UpdateProductDto } from "./updateProduct.dto";
import { CustomError } from "@/shared/errors/custom.error";

export class UpdateProductUseCase {
    async execute(uuid: string, updateProductDto: UpdateProductDto): Promise<ProductEntity | null> {
        try {
            const row = await ProductSequelize.findOne({ where: { uuid } });
            if (!row) return null;

            if (updateProductDto.sku && updateProductDto.sku !== row.sku) {
                const taken = await ProductSequelize.findOne({
                    where: { sku: updateProductDto.sku, id: { [Op.ne]: row.id } },
                    paranoid: false,
                });
                if (taken) {
                    throw CustomError.resourceExists(`Product with sku '${updateProductDto.sku}' already exists`);
                }
            }

            const updated = await row.update(updateProductDto.toValues());
            return ProductEntity.fromRow(updated);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            if (error instanceof UniqueConstraintError) {
                throw CustomError.resourceExists(`Product with sku '${updateProductDto.sku}' already exists`);
            }
            throw CustomError.internalServer(`Error updating product: ${error}`);
        }
    }
}
