import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/api/index';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    const response = await app.fetch(
      new Request(url, {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
        body: req.body ? JSON.stringify(req.body) : undefined,
      })
    );

    res.status(response.status);
    
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
