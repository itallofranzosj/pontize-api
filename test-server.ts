import { serve } from '@hono/node-server';
import app from './src/api/index';

const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`✅ Test server running on http://localhost:${info.port}`);
});
