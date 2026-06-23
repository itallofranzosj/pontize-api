import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "./middleware/auth";
import { authRouter } from "./routes/auth";
import { mfaRouter } from "./routes/mfa";
import { marcacoesRouter } from "./routes/marcacoes";
import { colaboradoresRouter } from "./routes/colaboradores";
import { dispositivosRouter } from "./routes/dispositivos";
import { repDevicesRouter } from "./routes/rep-devices";
import { relatoriosRouter } from "./routes/relatorios";
import { setoresRouter } from "./routes/setores";
import { healthRouter } from "./routes/health";

const app = new Hono();

// CORS
app.use("*", cors({ origin: ["https://app.pontize.com", "http://localhost:8084"] }));

// Middleware: Auth com Supabase
app.use("*", authMiddleware);

// Health Check (público)
app.route("/health", healthRouter);

// Auth Routes (público)
app.route("/auth", authRouter);
app.route("/auth/mfa", mfaRouter);

// API Routes (protegidas)
app.route("/v1/marcacoes", marcacoesRouter);
app.route("/v1/colaboradores", colaboradoresRouter);
app.route("/v1/dispositivos", dispositivosRouter);
app.route("/v1/rep-devices", repDevicesRouter);
app.route("/v1/relatorios", relatoriosRouter);
app.route("/v1/setores", setoresRouter);

// Error handling
app.onError((err, c) => {
  console.error("[API Error]", err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        status: err.status,
      },
      err.status,
    );
  }

  return c.json(
    {
      error: "Internal Server Error",
      status: 500,
    },
    500,
  );
});

// 404
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      path: c.req.path,
      status: 404,
    },
    404,
  );
});

export default app;
