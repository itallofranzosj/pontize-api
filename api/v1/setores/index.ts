import { VercelRequest, VercelResponse } from '@vercel/node';
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../../dist/api/index.js');
    const queryStr = req.url?.split('?')[1] || '';
    const response = await app.fetch(
      new Request(`https://api.pontize.com/v1/setores?${queryStr}`, {
        method: 'GET',
        headers: new Headers(req.headers as Record<string, string>),
      })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
