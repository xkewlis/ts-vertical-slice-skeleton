import { Op, Order, WhereOptions } from "sequelize";
import { ProductSequelize } from "../database/Product";
import { ProductEntity, ProductsPaginatedEntity } from "../entities";
import { ProductPaginationDto } from "./productPagination.dto";
import { CustomError } from "@/shared/errors/custom.error";
import { Sorting } from "@/shared/interfaces";
import productConstant from "../product.constant";

export class ListProductsUseCase {
    async execute(paginationDto: ProductPaginationDto): Promise<ProductsPaginatedEntity> {
        try {
            const { itemsPerPage, page } = paginationDto;

            const { count, rows } = await ProductSequelize.findAndCountAll({
                where: this.buildWhere(paginationDto),
                limit: itemsPerPage,
                offset: (page - 1) * itemsPerPage,
                order: this.buildOrder(paginationDto.sorting),
            });

            return new ProductsPaginatedEntity(
                count,
                rows.map(row => ProductEntity.fromRow(row)),
            );
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error getting paginated products: ${error}`);
        }
    }

    private buildWhere(paginationDto: ProductPaginationDto): WhereOptions {
        const where: WhereOptions = {};
        if (paginationDto.name) where.name = { [Op.like]: `%${this.escapeLike(paginationDto.name)}%` };
        return where;
    }

    private buildOrder(sorting: Sorting | null | undefined): Order {
        const validSorting = sorting && productConstant.SORTING_KEYS.includes(sorting.key)
            ? sorting
            : { key: 'createdAt', order: 'DESC' as const };

        return [
            [validSorting.key, validSorting.order],
            ['uuid', 'ASC'],
        ];
    }

    private escapeLike(value: string): string {
        return value.replace(/[\\%_]/g, char => `\\${char}`);
    }
}
