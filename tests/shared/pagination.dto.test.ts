import { describe, expect, it } from "bun:test";
import { PaginationDto } from "@/shared/dtos/pagination.dto";

describe('PaginationDto', () => {
    it('applies defaults', () => {
        const [error, dto] = PaginationDto.create({});

        expect(error).toBeUndefined();
        expect(dto).toMatchObject({ itemsPerPage: 20, page: 1, sorting: { key: 'createdAt', order: 'DESC' } });
    });

    it('normalizes an invalid sorting order to DESC', () => {
        const [, dto] = PaginationDto.create({ sortingOrder: 'DROP' });

        expect(dto?.sorting?.order).toBe('DESC');
    });

    it('rejects a page lower than 1', () => {
        const [error] = PaginationDto.create({ page: '0' });

        expect(error).toBe('page must be an integer greater than or equal to 1');
    });
});
