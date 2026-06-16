"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const http_exception_1 = require("hono/http-exception");
const auth_1 = require("./middleware/auth");
const auth_2 = require("./routes/auth");
const marcacoes_1 = require("./routes/marcacoes");
const colaboradores_1 = require("./routes/colaboradores");
const relatorios_1 = require("./routes/relatorios");
const setores_1 = require("./routes/setores");
const health_1 = require("./routes/health");
const app = new hono_1.Hono();
// CORS
app.use("*", (0, cors_1.cors)({ origin: ["https://app.pontize.com", "http://localhost:8084"] }));
// Middleware: Auth com Supabase
app.use("*", auth_1.authMiddleware);
// Health Check (público)
app.route("/health", health_1.healthRouter);
// Auth Routes (público)
app.route("/auth", auth_2.authRouter);
// API Routes (protegidas)
app.route("/v1/marcacoes", marcacoes_1.marcacoesRouter);
app.route("/v1/colaboradores", colaboradores_1.colaboradoresRouter);
app.route("/v1/relatorios", relatorios_1.relatoriosRouter);
app.route("/v1/setores", setores_1.setoresRouter);
// Error handling
app.onError((err, c) => {
    console.error("[API Error]", err);
    if (err instanceof http_exception_1.HTTPException) {
        return c.json({
            error: err.message,
            status: err.status,
        }, err.status);
    }
    return c.json({
        error: "Internal Server Error",
        status: 500,
    }, 500);
});
// 404
app.notFound((c) => {
    return c.json({
        error: "Not Found",
        path: c.req.path,
        status: 404,
    }, 404);
});
exports.default = app;
