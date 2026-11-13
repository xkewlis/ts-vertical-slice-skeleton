import { ProductEntity } from "./product.entity";

export class ProductsPaginatedEntity {
    constructor(
        public totalItems: number,
        public products: ProductEntity[],
    ){}
}
