import { Sorting } from "@/shared/interfaces";
import constant from "@/shared/constant";

export class PaginationDto {
    constructor(
        public itemsPerPage: number,
        public page: number,
        public sorting: Sorting | undefined | null,
    ) {
        if (this.sorting && !['ASC', 'DESC'].includes(this.sorting.order)) {
            this.sorting.order = 'DESC';
        }
    }

    static create(object: { [key: string]: any }): [string?, PaginationDto?] {

        const {
            itemsPerPage,
            page,
            sortingKey,
            sortingOrder,
        } = object

        const parsedItemsPerPage = Number(itemsPerPage ?? constant.PAGINATION.DEFAULT_ITEMS_PER_PAGE);
        const parsedPage = Number(page ?? 1);

        if (!Number.isInteger(parsedItemsPerPage) || parsedItemsPerPage < 1 || parsedItemsPerPage > constant.PAGINATION.MAX_ITEMS_PER_PAGE) {
            return [`itemsPerPage must be an integer between 1 and ${constant.PAGINATION.MAX_ITEMS_PER_PAGE}`];
        }

        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return ['page must be an integer greater than or equal to 1'];
        }

        return [
            undefined,
            new PaginationDto(
                parsedItemsPerPage,
                parsedPage,
                {
                    key: sortingKey ?? 'createdAt',
                    order: sortingOrder ?? 'DESC',
                } as Sorting,
            )
        ]
    }
}
