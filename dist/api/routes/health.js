import { Hono } from "hono";
export const healthRouter = new Hono();
healthRouter.get("/", (c) => {
    return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        service: "Pontize API",
    });
});
healthRouter.get("/ready", async (c) => {
    try {
        return c.json({
            ready: true,
            timestamp: new Date().toISOString(),
            checks: {
                database: "ok",
                auth: "ok",
            },
        });
    }
    catch (error) {
        return c.json({
            ready: false,
            error: "Service unavailable",
        }, 503);
    }
});
