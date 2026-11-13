import { Command } from "commander";
import { associations } from "@/database/associations";
import { runCliCommand } from "@/cli/runCliCommand";
import { MigrationDatasource } from "@/database/migration/migration.datasource";
import { MigrationEntity } from "@/database/migration/migration.entity";
import { MigrationSequelize } from "@/database/models";
import migrationSeederData from "@/database/seeders/data/migration.seeder.data";
import MigrationSeederExec from "@/database/seeders/exec/migration.seeder.exec";
import type { MigrationSeederData } from "@/shared";
import { CustomError } from "@/shared/errors/custom.error";

const makeMigrationListCommand = (): Command =>
    new Command('migration:list')
        .description('Lista las migraciones y su estado')
        .action(() =>
            runCliCommand(async () => {
                await MigrationSequelize.sync();
                const rows = await new MigrationDatasource().getAll();

                if (!rows.length) {
                    console.log('  (no hay migraciones en la tabla)');
                    return;
                }

                for (const row of rows) {
                    const state = row.executed ? 'ejecutada' : 'pendiente';
                    const registered = migrationSeederData.some(
                        migration => migration.abbreviation === row.abbreviation,
                    ) ? '' : ' (ya no esta en el registro)';
                    console.log(`  [${row.abbreviation}] ${row.name.padEnd(28)} ${state}${registered}`);
                }
            }),
        );

const makeMigrationRunCommand = (): Command =>
    new Command('migration:run')
        .description('Fuerza una migracion por nombre')
        .argument('<name>', 'Nombre de la migracion')
        .action((name: string) =>
            runCliCommand(async () => {
                const [migrationData, migrationEntity] = await resolveMigration(name);
                const migration = new migrationData.migration();

                console.log(`[migration] running ${migrationData.name}`);

                await migration.up();
                await new MigrationDatasource().setExecuted(migrationEntity, true);

                console.log(`[migration] ${migrationData.name} done`);
            }),
        );

const makeMigrationUndoCommand = (): Command =>
    new Command('migration:undo')
        .description('Revierte una migracion y la deja pendiente')
        .argument('<name>', 'Nombre de la migracion')
        .action((name: string) =>
            runCliCommand(async () => {
                const [migrationData, migrationEntity] = await resolveMigration(name);
                const migration = new migrationData.migration();

                if (!migration.down) {
                    throw CustomError.badRequest(`Migration "${migrationData.name}" does not implement down()`);
                }

                console.log(`[migration] reverting ${migrationData.name}`);

                await migration.down();
                await new MigrationDatasource().setExecuted(migrationEntity, false);

                console.log(`[migration] ${migrationData.name} reverted and marked as pending`);
            }),
        );

const makeMigrationPendingCommand = (): Command =>
    new Command('migration:pending')
        .description('Registra y ejecuta todas las migraciones pendientes')
        .action(() =>
            runCliCommand(async () => {
                const exec = new MigrationSeederExec();

                associations();
                await MigrationSequelize.sync();
                await exec.up();
                await exec.execute();
            }),
        );

export const registerMigrationCommands = (program: Command): void => {
    program.addCommand(makeMigrationListCommand());
    program.addCommand(makeMigrationRunCommand());
    program.addCommand(makeMigrationUndoCommand());
    program.addCommand(makeMigrationPendingCommand());
};

const resolveMigration = async (name: string): Promise<[MigrationSeederData, MigrationEntity]> => {
    const migrationData = migrationSeederData.find(
        migration => migration.name === name || migration.abbreviation === name,
    );

    if (!migrationData) {
        const availableMigrations = migrationSeederData.map(migration => migration.name).join(', ') || '(none)';
        throw CustomError.notFound(`Unknown migration "${name}". Available: ${availableMigrations}`);
    }

    associations();
    await MigrationSequelize.sync();
    await new MigrationSeederExec().up();

    const migrationEntity = await new MigrationDatasource().getByAbbreviation(migrationData.abbreviation);

    if (!migrationEntity) {
        throw CustomError.internalServer(`Migration "${migrationData.name}" could not be registered`);
    }

    return [migrationData, migrationEntity];
};
