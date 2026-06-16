import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (_req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Pontize API'
  });
};
