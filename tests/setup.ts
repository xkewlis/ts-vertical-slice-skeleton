import { afterAll } from "bun:test";

// Valores por defecto para que la instancia de Sequelize se construya en tests sin un .env.
Bun.env.DB_HOST ??= '127.0.0.1';
Bun.env.DB_PORT ??= '3306';
Bun.env.DB_NAME ??= 'app_test';
Bun.env.DB_USER ??= 'app';
Bun.env.DB_PASSWORD ??= 'change-me';

// Bun corre todos los archivos de test en el mismo proceso: la conexión de Sequelize es compartida
// y se cierra una sola vez al final, no en cada archivo.
afterAll(async () => {
    const { default: sequelize } = await import("@/database/sequelize");
    await sequelize.close();
});
