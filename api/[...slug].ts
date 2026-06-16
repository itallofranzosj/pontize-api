import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { default: app } = await import('../dist/api/index.js');
    
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const pathname = req.url || '/';
    const url = new URL(pathname, `${protocol}://${host}`);
    
    const response = await app.fetch(
      new Request(url.toString(), {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
        body: ['GET', 'HEAD'].includes(req.method || '') 
          ? undefined 
          : typeof req.body === 'string' 
            ? req.body 
            : JSON.stringify(req.body),
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
