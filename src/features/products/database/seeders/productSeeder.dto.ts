import { CreateProductDto } from "@/features/products/createProduct/createProduct.dto";
import constant from "@/shared/constant";

export class ProductSeederDto {
    constructor(
        public uuid: string,
        public sku: string,
        public name: string,
        public description: string | null,
        public price: string,
        public stock: number,
    ){}

    static create(object: { [key: string]: any }): [string[]?, ProductSeederDto?] {
        const { uuid } = object;
        const [productErrors, createProductDto] = CreateProductDto.create(object);
        const errors: string[] = [...(productErrors ?? [])];

        if (!uuid) errors.push("UUID is required");
        else if (typeof uuid !== 'string' || !constant.REGEX.UUID.test(uuid)) errors.push("UUID is invalid");

        if (errors.length > 0 || !createProductDto) return [errors];

        return [undefined, new ProductSeederDto(
            uuid,
            createProductDto.sku,
            createProductDto.name,
            createProductDto.description,
            createProductDto.price,
            createProductDto.stock,
        )];
    }
}
