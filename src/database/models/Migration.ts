import {DataTypes, Model} from "sequelize";
import sequelize from "@/database/sequelize";

interface MigrationRow {
    id: number;
    name: string;
    abbreviation: string;
    executed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MigrationSequelize extends Model <MigrationRow, Omit<MigrationRow,'id'>> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare executed: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MigrationSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    executed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    timestamps: true,
    tableName: "migrations",
    underscored: true,
    paranoid: true,
});
