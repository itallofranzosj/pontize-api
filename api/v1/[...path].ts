import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../../dist/api/index.js');
    const path = req.query.path 
      ? (Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path)
      : '';
    
    const response = await app.fetch(
      new Request(`https://api.pontize.com/v1/${path}`, {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
        body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req.body ? JSON.stringify(req.body) : undefined,
      })
    );
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
