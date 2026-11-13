import { associations } from "@/database/associations";
import MigrationSeederExec from "@/database/seeders/exec/migration.seeder.exec";
import { MigrationSequelize, ProductSequelize } from "./models";

export const DbService = async (): Promise<void> => {
    associations();

    // sync() solo crea las tablas que no existen: nunca altera una existente.
    await ProductSequelize.sync();
    await MigrationSequelize.sync();

    // El servidor solo se levanta cuando todas las migraciones terminan correctamente.
    const migrationSeederExec = new MigrationSeederExec();
    await migrationSeederExec.up();
    await migrationSeederExec.execute();
};
