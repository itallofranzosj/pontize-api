import { serve } from "@hono/node-server";
import app from "./api/index";

const port = parseInt(process.env.PORT || "3000");

console.log(`✅ Starting Pontize API...`);
console.log(`📍 Health: http://localhost:${port}/health`);
console.log(`📍 API: http://localhost:${port}/v1`);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`✅ Pontize API running on http://localhost:${info.port}`);
});
