import { MigrationDto } from "@/database/migration/migration.dto";
import { MigrationDatasource } from "@/database/migration/migration.datasource";
import migrationSeederData from "@/database/seeders/data/migration.seeder.data";
import { CustomError } from "@/shared/errors/custom.error";

export default class MigrationSeederExec {
    public async up(): Promise<void> {
        try {
            for (const migration of migrationSeederData) {
                const [errors, migrationDto] = MigrationDto.create(migration);

                if (errors) {
                    console.error(`Validation errors: ${errors.join(', ')}`);
                    continue;
                }

                if (migrationDto) {
                    await new MigrationDatasource().register(migrationDto);
                }
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error seeding migrations: ${error}`);
        }
    }

    public async execute(): Promise<void> {
        try {
            const migrations = await new MigrationDatasource().getNotExecuted();

            for (const migration of migrations) {
                const migrationData = migrationSeederData.find(
                    data => data.abbreviation === migration.abbreviation,
                );

                if (!migrationData) {
                    console.warn(`[migration] "${migration.name}" is no longer registered, skipping`);
                    continue;
                }

                console.log(`[migration] running ${migrationData.name}`);

                await new migrationData.migration().up();
                await new MigrationDatasource().setExecuted(migration, true);

                console.log(`[migration] ${migrationData.name} done`);
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error executing migrations: ${error}`);
        }
    }
}
