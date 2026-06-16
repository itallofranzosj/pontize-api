import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../../dist/api/index.js');
    
    const path = req.query.path 
      ? Array.isArray(req.query.path) 
        ? '/' + req.query.path.join('/') 
        : '/' + req.query.path
      : '/v1';
    
    const url = new URL(`/v1${path}`, 'https://api.pontize.com');
    
    const response = await app.fetch(
      new Request(url.toString(), {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
        body: ['GET', 'HEAD'].includes(req.method || '') 
          ? undefined 
          : req.body ? JSON.stringify(req.body) : undefined,
      })
    );

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
