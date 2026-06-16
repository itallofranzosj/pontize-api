import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (_req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../dist/api/index.js');
    const response = await app.fetch(
      new Request('https://api.pontize.com/health/ready', { method: 'GET' })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
