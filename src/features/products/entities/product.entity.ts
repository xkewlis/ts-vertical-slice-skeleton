import { ProductSequelize } from "../database/Product";

export class ProductEntity {
    constructor(
        public uuid: string,
        public sku: string,
        public name: string,
        public description: string | null,
        public price: string,
        public stock: number,
        public createdAt?: Date,
        public updatedAt?: Date,
    ){}

    static fromRow(row: ProductSequelize): ProductEntity {
        return new ProductEntity(
            row.uuid,
            row.sku,
            row.name,
            row.description,
            row.price,
            row.stock,
            row.createdAt,
            row.updatedAt,
        );
    }

    toJSON() {
        return {
            uuid: this.uuid,
            sku: this.sku,
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock
        }
    }
}
