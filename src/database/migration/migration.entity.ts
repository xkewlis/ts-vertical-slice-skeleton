import { MigrationSequelize } from "@/database/models";

export class MigrationEntity {
    constructor(
        public id: number,
        public name: string,
        public abbreviation: string,
        public executed: boolean,
    ){}

    static fromRow(row: MigrationSequelize): MigrationEntity {
        return new MigrationEntity(
            row.id,
            row.name,
            row.abbreviation,
            row.executed,
        );
    }
}
