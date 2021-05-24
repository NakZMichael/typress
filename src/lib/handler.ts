import { Request, Response } from 'express';

export type ExpressHandler = (req: Request, res: Response) => void

export type TypressHandler<Req extends BaseRequest, Res extends BaseResponse> = (req: Req, res: Res) => Promise<{req: BaseRequest, res: BaseResponse}>
export type TypressBaseHandler = (req: BaseRequest, res: BaseResponse) => Promise<{req: BaseRequest, res: BaseResponse}>

class TypressFactory<FReq extends BaseRequest, FRes extends BaseResponse>{

  createContext: (req: BaseRequest, res: BaseResponse) => {
    req: FReq,
    res: FRes
  }

  constructor(middleware: (req: BaseRequest, res: BaseResponse) => {
    req: FReq,
    res: FRes
  }){
    this.createContext = middleware;
  }
  create = (handler: TypressHandler<BaseRequest & Partial<Omit<FReq, keyof BaseRequest>>, BaseResponse & Partial<Omit<FRes, keyof BaseResponse>>> ): TypressBaseHandler => {
    return generateBaseHandler(handler, this);
  }

  use< NReq extends BaseRequest, NRes extends BaseResponse>(middleware: (preq: FReq, pres: FRes) => {req: NReq, res: NRes}): TypressFactory<NReq, NRes>{
    return new TypressFactory(
      (req, res) => {
        const previousContext = this.createContext(req, res);
        return middleware(previousContext.req, previousContext.res);
      }
    );
  }
}

export function generateBaseHandler<FReq extends Req, FRes extends Res, Req extends BaseRequest, Res extends BaseResponse >(handler: TypressHandler<Req, Res>, factory: TypressFactory<FReq, FRes>): TypressBaseHandler{
  return async(req: BaseRequest, res: BaseResponse) => {
    const context = factory.createContext(req, res);
    return handler(context.req, context.res);
  };
}

export interface BaseRequest extends Request{
  // リクエスト一つづつにIDを割り振った方がロギングしやすい
  id: string
  body: Buffer
}

export interface BaseResponse  extends Response{
  body: any
}


export function createFactory<FReq extends BaseRequest, FRes extends BaseResponse>(middleware?: (req: BaseRequest, res: BaseResponse) => {req: FReq, res: FRes}){
  if(middleware){
    return new TypressFactory(middleware);
  }
  return new TypressFactory(
    (req: BaseRequest, res: BaseResponse) => {
      return { req, res };}
  );
}