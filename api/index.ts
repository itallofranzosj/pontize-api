import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Importar a app Hono apenas quando necessário
    const { default: app } = await import('../dist/api/index.js');
    
    // Criar URL completa
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url || '/', `${protocol}://${host}`);
    
    // Chamar o handler Hono
    const response = await app.fetch(
      new Request(url.toString(), {
        method: req.method || 'GET',
        headers: req.headers as HeadersInit,
        body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req.body,
      })
    );

    // Retornar resposta
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
