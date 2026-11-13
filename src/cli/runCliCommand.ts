import sequelize from "@/database/sequelize";

const reportError = (error: unknown): void => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
};

export const runCliCommand = async (action: () => Promise<void>): Promise<void> => {
    try {
        await action();
    } catch (error) {
        reportError(error);
    }
    await sequelize.close().catch(reportError);
};
