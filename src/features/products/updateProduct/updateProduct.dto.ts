import productConstant from "../product.constant";

export class UpdateProductDto {
    constructor(
        public sku?: string,
        public name?: string,
        public description?: string | null,
        public price?: string,
        public stock?: number,
    ){}

    static create(object: { [key: string]: any }): [string[]?, UpdateProductDto?] {
        const { sku, name, description, price, stock } = object;
        const errors: string[] = [];

        if (sku === undefined && name === undefined && description === undefined && price === undefined && stock === undefined) {
            errors.push("At least one field is required");
        }
        if (sku !== undefined && (typeof sku !== 'string' || !productConstant.SKU.REGEX.test(sku))) errors.push(`SKU must contain only uppercase letters, digits and dashes (max ${productConstant.SKU.MAX_LENGTH})`);
        if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.length > productConstant.NAME.MAX_LENGTH)) errors.push(`Name must be a non empty string of up to ${productConstant.NAME.MAX_LENGTH} characters`);
        if (description !== undefined && description !== null && typeof description !== 'string') errors.push("Description must be a string");
        if (price !== undefined && (typeof price !== 'string' || !productConstant.PRICE.REGEX.test(price))) errors.push("Price must be a decimal string with up to 2 decimals, e.g. \"19.90\"");
        if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) errors.push("Stock must be an integer greater than or equal to 0");

        if (errors.length > 0) return [errors];

        return [undefined, new UpdateProductDto(
            sku,
            name?.trim(),
            description,
            price,
            stock,
        )];
    }

    toValues(): Partial<UpdateProductDto> {
        return Object.fromEntries(
            Object.entries(this).filter(([, value]) => value !== undefined),
        );
    }
}
