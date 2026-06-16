import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/api/index';

export default async (req: VercelRequest, res: VercelResponse) => {
  return app.fetch(
    new Request(new URL(req.url || '/', `http://${req.headers.host}`), {
      method: req.method,
      headers: req.headers as any,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req.body,
    })
  )
    .then(async (response) => {
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.send(await response.text());
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Error' });
    });
};
