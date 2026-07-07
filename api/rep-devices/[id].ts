import { VercelRequest, VercelResponse } from '@vercel/node';

// PATCH /api/rep-devices/:id — atualiza unidade vinculada / ativo / ingest_enabled
// de um relógio. Usado pelo Pontize Agent (Windows) para editar e remover relógios.
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../../dist/api/index.js');
    const id = req.query.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'id inválido' });
      return;
    }
    const method = req.method || 'PATCH';
    const response = await app.fetch(
      new Request(`https://api.pontize.com/v1/rep-devices/${encodeURIComponent(id)}`, {
        method,
        headers: new Headers(req.headers as Record<string, string>),
        body: method !== 'GET' && method !== 'HEAD' && req.body
          ? JSON.stringify(req.body)
          : undefined,
      })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
