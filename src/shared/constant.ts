// Constantes compartidas por varios features. Las de un solo feature van en src/features/<feature>/<feature>.constant.ts.
export default {
    PAGINATION: {
        DEFAULT_ITEMS_PER_PAGE: 20,
        MAX_ITEMS_PER_PAGE: 100,
    },
    REGEX: {
        UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    },
}
