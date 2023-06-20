import express, { Request, Response } from 'express';
import HttpServer from "./HttpServer";

// Framework and Driver
export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        const output = await callback(req.params, req.body, req.headers);
        res.json(output);
      } catch(e: any) {
        res.status(422).json({
          message: e.message,
        });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
  }
  
}