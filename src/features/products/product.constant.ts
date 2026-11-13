// Constantes propias del feature products. Lo que usen varios features va en src/shared/constant.ts.
export default {
    SKU: {
        MAX_LENGTH: 64,
        REGEX: /^[A-Z0-9-]{1,64}$/,
    },
    NAME: {
        MAX_LENGTH: 160,
    },
    PRICE: {
        PRECISION: 12,
        SCALE: 2,
        REGEX: /^\d{1,10}(\.\d{1,2})?$/,
    },
    SEARCH: {
        MAX_LENGTH: 100,
    },
    SORTING_KEYS: ["sku", "name", "price", "stock", "createdAt", "updatedAt"],
}
