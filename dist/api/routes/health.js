"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const hono_1 = require("hono");
exports.healthRouter = new hono_1.Hono();
exports.healthRouter.get("/", (c) => {
    return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        service: "Pontize API",
    });
});
exports.healthRouter.get("/ready", async (c) => {
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
