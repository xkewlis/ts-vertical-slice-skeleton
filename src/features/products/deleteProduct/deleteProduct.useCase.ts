import { ProductSequelize } from "../database/Product";
import { CustomError } from "@/shared/errors/custom.error";

export class DeleteProductUseCase {
    async execute(uuid: string): Promise<boolean> {
        try {
            const deleted = await ProductSequelize.destroy({ where: { uuid } });
            return deleted > 0;
        } catch (error) {
            throw CustomError.internalServer(`Error deleting product: ${error}`);
        }
    }
}
