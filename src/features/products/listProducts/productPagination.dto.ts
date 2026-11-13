import { PaginationDto } from "@/shared/dtos/pagination.dto";
import { Sorting } from "@/shared/interfaces";
import productConstant from "../product.constant";

export class ProductPaginationDto {
    constructor(
        public itemsPerPage: number,
        public page: number,
        public sorting: Sorting | undefined | null,
        public name?: string,
    ){}

    static create(object: { [key: string]: any }): [string[]?, ProductPaginationDto?] {
        const [paginationErrors, paginationDto] = PaginationDto.create(object);
        const { name } = object;
        const errors: string[] = [];

        if (paginationErrors) errors.push(paginationErrors);

        if (name !== undefined && (typeof name !== 'string' || name.length > productConstant.SEARCH.MAX_LENGTH)) {
            errors.push(`name must be a string of up to ${productConstant.SEARCH.MAX_LENGTH} characters`);
        }

        if (errors.length > 0 || !paginationDto) return [errors];

        return [undefined, new ProductPaginationDto(
            paginationDto.itemsPerPage,
            paginationDto.page,
            paginationDto.sorting,
            name,
        )];
    }
}
