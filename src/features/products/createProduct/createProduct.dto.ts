import productConstant from "../product.constant";

export class CreateProductDto {
    constructor(
        public sku: string,
        public name: string,
        public description: string | null,
        public price: string,
        public stock: number,
    ){}

    static create(object: { [key: string]: any }): [string[]?, CreateProductDto?] {
        const { sku, name, description, price, stock } = object;
        const errors: string[] = [];

        if (!sku) errors.push("SKU is required");
        else if (typeof sku !== 'string' || !productConstant.SKU.REGEX.test(sku)) errors.push(`SKU must contain only uppercase letters, digits and dashes (max ${productConstant.SKU.MAX_LENGTH})`);
        if (!name) errors.push("Name is required");
        else if (typeof name !== 'string' || name.length > productConstant.NAME.MAX_LENGTH) errors.push(`Name must be a string of up to ${productConstant.NAME.MAX_LENGTH} characters`);
        if (description !== undefined && description !== null && typeof description !== 'string') errors.push("Description must be a string");
        if (!price) errors.push("Price is required");
        else if (typeof price !== 'string' || !productConstant.PRICE.REGEX.test(price)) errors.push("Price must be a decimal string with up to 2 decimals, e.g. \"19.90\"");
        if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) errors.push("Stock must be an integer greater than or equal to 0");

        if (errors.length > 0) return [errors];

        return [undefined, new CreateProductDto(
            sku,
            name.trim(),
            description ?? null,
            price,
            stock ?? 0,
        )];
    }
}
