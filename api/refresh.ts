import { VercelRequest, VercelResponse } from '@vercel/node';

// POST /api/refresh — renova o access_token via refresh_token.
// Usado pelo Pontize Agent (Windows): sem esta rota a sessão do agente
// expirava em ~1h e o usuário era mandado de volta pro login.
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../dist/api/index.js');
    const response = await app.fetch(
      new Request('https://api.pontize.com/auth/refresh', {
        method: 'POST',
        headers: new Headers(req.headers as Record<string, string>),
        body: req.body ? JSON.stringify(req.body) : undefined,
      })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
