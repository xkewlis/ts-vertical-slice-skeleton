import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { DbService } from "@/database/init";
import { Routes } from "@/routes/routes";
import env from "@/shared/env";

export class Server {
    public readonly app: Hono;
    private readonly port: number;

    constructor() {
        this.app = new Hono();
        this.port = Number(env.PORT ?? 3000);
    }

    public async start(): Promise<void> {
        console.time('server-start');
        await DbService();
        this.middlewares();
        this.app.route('/', new Routes().routes);
        this.server();
        console.timeEnd('server-start');
    }

    public middlewares(): void {
        this.app.use('*', cors());
        this.app.use('*', secureHeaders());
    }

    public server(): void {
        const server = Bun.serve({
            fetch: this.app.fetch,
            port: this.port,
        });
        console.log(`Server is running on http://localhost:${server.port}`);
    }
}
