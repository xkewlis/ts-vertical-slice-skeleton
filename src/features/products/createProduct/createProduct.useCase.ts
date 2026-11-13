import { randomUUID } from "node:crypto";
import { UniqueConstraintError } from "sequelize";
import { ProductSequelize } from "../database/Product";
import { ProductEntity } from "../entities";
import { CreateProductDto } from "./createProduct.dto";
import { CustomError } from "@/shared/errors/custom.error";

export class CreateProductUseCase {
    async execute(createProductDto: CreateProductDto): Promise<ProductEntity> {
        try {
            const existing = await ProductSequelize.findOne({
                where: { sku: createProductDto.sku },
                paranoid: false,
            });
            if (existing) {
                throw CustomError.resourceExists(`Product with sku '${createProductDto.sku}' already exists`);
            }

            const row = await ProductSequelize.create({
                uuid: randomUUID(),
                sku: createProductDto.sku,
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                stock: createProductDto.stock,
            });

            return ProductEntity.fromRow(row);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            if (error instanceof UniqueConstraintError) {
                throw CustomError.resourceExists(`Product with sku '${createProductDto.sku}' already exists`);
            }
            throw CustomError.internalServer(`Error creating product: ${error}`);
        }
    }
}
