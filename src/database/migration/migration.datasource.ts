import { MigrationDto } from "./migration.dto";
import { MigrationEntity } from "./migration.entity";
import { MigrationSequelize } from "@/database/models";
import { CustomError } from "@/shared/errors/custom.error";

export class MigrationDatasource {
    async register(migrationDto: MigrationDto): Promise<MigrationEntity> {
        try {
            const [row] = await MigrationSequelize.findOrCreate({
                where: { abbreviation: migrationDto.abbreviation },
                defaults: {
                    name: migrationDto.name,
                    abbreviation: migrationDto.abbreviation,
                    executed: false,
                },
            });

            return MigrationEntity.fromRow(row);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error registering migration: ${error}`);
        }
    }

    async getAll(): Promise<MigrationEntity[]> {
        try {
            const rows = await MigrationSequelize.findAll({ order: [['id', 'ASC']] });
            return rows.map(row => MigrationEntity.fromRow(row));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error getting migrations: ${error}`);
        }
    }

    async getNotExecuted(): Promise<MigrationEntity[]> {
        try {
            const rows = await MigrationSequelize.findAll({
                where: { executed: false },
                order: [['id', 'ASC']],
            });

            return rows.map(row => MigrationEntity.fromRow(row));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error getting not executed migrations: ${error}`);
        }
    }

    async getByAbbreviation(abbreviation: string): Promise<MigrationEntity | null> {
        try {
            const row = await MigrationSequelize.findOne({ where: { abbreviation } });
            return row ? MigrationEntity.fromRow(row) : null;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error getting migration by abbreviation: ${error}`);
        }
    }

    async setExecuted(migration: MigrationEntity, executed: boolean): Promise<MigrationEntity> {
        try {
            await MigrationSequelize.update({ executed }, { where: { id: migration.id } });
            return new MigrationEntity(migration.id, migration.name, migration.abbreviation, executed);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error updating migration: ${error}`);
        }
    }
}
