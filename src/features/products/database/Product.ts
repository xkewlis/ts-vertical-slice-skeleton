import {DataTypes, Model} from "sequelize";
import sequelize from "@/database/sequelize";
import productConstant from "../product.constant";

interface ProductRow {
    id: number;
    uuid: string;
    sku: string;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class ProductSequelize extends Model <ProductRow, Omit<ProductRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare sku: string;
    declare name: string;
    declare description: string | null;
    // DECIMAL: mysql2 lo devuelve como string para no perder precisión.
    declare price: string;
    declare stock: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

ProductSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    sku: {
        type: DataTypes.STRING(productConstant.SKU.MAX_LENGTH),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(productConstant.NAME.MAX_LENGTH),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(productConstant.PRICE.PRECISION, productConstant.PRICE.SCALE),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
    timestamps: true,
    tableName: "products",
    underscored: true,
    paranoid: true,
});
