import { VercelRequest, VercelResponse } from '@vercel/node';

// GET /api/unidades — lista unidades/filiais da empresa do usuário autenticado.
// Usado pelo Pontize Agent (Windows) ao cadastrar um relógio.
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../dist/api/index.js');
    const queryStr = req.url?.split('?')[1] || '';
    const response = await app.fetch(
      new Request(`https://api.pontize.com/v1/unidades?${queryStr}`, {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
      })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
