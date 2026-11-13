import { Server } from "@/server";

new Server().start().catch((error) => {
    console.error('Server startup failed:', error);
    process.exitCode = 1;
});
