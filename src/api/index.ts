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
import { unidadesRouter } from "./routes/unidades";
import { relatoriosRouter } from "./routes/relatorios";
import { setoresRouter } from "./routes/setores";
import { healthRouter } from "./routes/health";
import { configRouter } from "./routes/config";
import { jornadasRouter } from "./routes/jornadas";
import { horariosRouter } from "./routes/horarios";
import { feriadosRouter } from "./routes/feriados";
import { alertasRouter } from "./routes/alertas";
import { localizacaoRouter } from "./routes/localizacao";
import { perfisJornadaRouter } from "./routes/perfis-jornada";
import { tiposAfastamentoRouter } from "./routes/tipos-afastamento";
import { afastamentosRouter } from "./routes/afastamentos";
import { ocorrenciasRouter } from "./routes/ocorrencias";
import { operacoesRouter } from "./routes/operacoes";
import { bancoHorasRouter } from "./routes/banco-horas";
import { relatorioCltRouter } from "./routes/relatorios-clt";
import { marcacaoValidadaRouter } from "./routes/marcacao-validada";
import { meuPerfilRouter } from "./routes/meu-perfil";
import { justificativasRouter } from "./routes/justificativas";
import { exportacaoRouter } from "./routes/exportacao";
import { permissoesRouter } from "./routes/permissoes";

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
app.route("/v1/unidades", unidadesRouter);
app.route("/v1/relatorios", relatoriosRouter);
app.route("/v1/setores", setoresRouter);

// Configurações CLT (Fase 1)
app.route("/v1/config", configRouter);
app.route("/v1/jornadas", jornadasRouter);
app.route("/v1/horarios-trabalho", horariosRouter);
app.route("/v1/dias-uteis", feriadosRouter);
app.route("/v1/alertas-config", alertasRouter);
app.route("/v1/localizacao-config", localizacaoRouter);
app.route("/v1/perfis-jornada", perfisJornadaRouter);

// Gestão de Colaborador (Fase 2)
app.route("/v1/tipos-afastamento", tiposAfastamentoRouter);
app.route("/v1/afastamentos", afastamentosRouter);
app.route("/v1/ocorrencias", ocorrenciasRouter);

// Operações Críticas (Fase 3)
app.route("/v1/operacoes", operacoesRouter);

// Banco de Horas (Fase 4)
app.route("/v1/banco-horas", bancoHorasRouter);

// Relatórios Avançados (Fase 5)
app.route("/v1/relatorios-clt", relatorioCltRouter);

// App Trabalhador (Fase 6)
app.route("/v1/marcacao-validada", marcacaoValidadaRouter);
app.route("/v1/meu-perfil", meuPerfilRouter);
app.route("/v1/justificativas", justificativasRouter);

// Exportação & Integração (Fase 7)
app.route("/v1/exportacao", exportacaoRouter);

// Auditoria & Security (Fase 8)
app.route("/v1/permissoes", permissoesRouter);

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
