import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/api/index";

export default async (req: VercelRequest, res: VercelResponse) => {
  return app.fetch(req, {
    waitUntil: (promise: Promise<any>) => promise,
  });
};
