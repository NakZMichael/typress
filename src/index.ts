import { BaseRequest, BaseResponse, createFactory, TypressHandler } from './lib/handler';
import { TypressRouter } from './lib/router';

const middleware = (req: BaseRequest, res: BaseResponse) => {
  return {
    req, 
    res,
  };
};

const factory = createFactory();

const handler: TypressHandler<BaseRequest, BaseResponse> = async(req, res) => {
  console.log(req.id);
  console.log(req.body);
  const newRes = Object.assign({}, res);
  newRes.body = 'Hello, Typress';
  return{
    req,
    res:newRes
  };
};

const baseHandler = factory.use(middleware).create(handler);


const router = new TypressRouter();

router.append([
  {
    method:'GET',
    path:'/',
    handler:baseHandler,
  },
  {
    method:'POST',
    path:'/',
    handler:baseHandler,
  }
]);

router.listen(4040, () => {
  console.log('Typress Server listen on port http://localhost:4040 !');
});