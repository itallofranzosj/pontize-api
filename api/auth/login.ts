import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../../dist/api/index.js');
    
    const response = await app.fetch(
      new Request(new URL('/auth/login', 'https://api.pontize.com'), {
        method: req.method || 'POST',
        headers: new Headers(req.headers as Record<string, string>),
        body: req.body ? JSON.stringify(req.body) : undefined,
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
