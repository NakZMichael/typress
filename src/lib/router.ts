import express, { NextFunction, Request, Response } from 'express';
import { raw } from 'body-parser';
import { BaseRequest, BaseResponse,  TypressBaseHandler } from './handler';

export class TypressRouter{
  private router = express()
  constructor(){
    this.router.use(express.raw({
      type:'*/*'
    }));
  }

  public append = (routes: TypressRoute[]): void => {
    routes.forEach((route) => {
      const handler = async(req: Request, res: Response, next: NextFunction) => {
        console.log('In handler', req.body);
        (async() => {
          const baseReq: BaseRequest = Object.assign({ id:'hello' }, req);
          const baseRes: BaseResponse = Object.assign({ body:undefined }, res);
          const context = await route.handler(baseReq, baseRes);
          res.status(200);
          res.send(context.res.body);
        })().catch(next);
      };
      switch(route.method){
      case 'GET':
        this.router.get(route.path, handler);
        break;
      case 'POST':
        this.router.post(route.path, handler);
        break;
      case 'PUT':
        this.router.put(route.path, handler);
        break;
      case 'DELETE':
        this.router.delete(route.path, handler);
        break;
      case '*':
        this.router.use(route.path, handler);
        break;
      }
    });
  }
  public listen = (port: number, callback: () => void): void => {
    this.router.listen(port, callback);
  }
}


interface TypressRoute{
  method: 'GET'|'POST'|'PUT'|'DELETE'|'*'
  path: string
  handler: TypressBaseHandler
}