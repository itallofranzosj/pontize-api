import app from '../dist/api/index.js';

export default async (req, res) => {
  try {
    const response = await app.fetch(req);
    
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
