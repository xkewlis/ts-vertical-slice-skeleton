import type { MigrationSeederData } from "@/shared";
import AddNameIndexToProducts from "@/features/products/database/migrations/addNameIndexToProducts.migration";
import ProductSeederExec from "@/features/products/database/seeders/exec/product.seeder.exec";

// Registro de migraciones y seeders de datos. Cada feature guarda sus clases en
// features/<feature>/database/migrations y features/<feature>/database/seeders/exec, y se registran aquí
// en el orden en que deben ejecutarse. Cada una corre una sola vez (tabla migrations).
const migrationSeederData = [
    {
        name: 'AddNameIndexToProducts',
        abbreviation: 'ANIP',
        migration: AddNameIndexToProducts,
    },
    {
        name: 'ProductSeeder',
        abbreviation: 'PRDS',
        migration: ProductSeederExec,
    },
] satisfies MigrationSeederData[];

export default migrationSeederData;
