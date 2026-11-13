import { Hono } from "hono";
import sequelize from "@/database/sequelize";
import { V1Routes } from "@/routes/v1.routes";

export class Routes {
    public get routes(): Hono {
        const routes = new Hono();
        routes.get("/", async (c) => {
            let dbStatus = false;
            let responseTime = null;

            try {
                const start = performance.now();
                await sequelize.query("SELECT NOW()");
                const end = performance.now();
                dbStatus = true;
                responseTime = (end - start) / 1000;
            } catch (error) {
                console.error("DB connection failed:", error);
                dbStatus = false;
            }
            return c.json({
                info: {
                    Title: 'TS Vertical Slice Skeleton',
                    Version: '0.1.0',
                },
                db: {
                    status: dbStatus,
                    responseTime
                }
            });
        });
        routes.route("/api/v1", new V1Routes().routes)
        return routes;
    }
}
