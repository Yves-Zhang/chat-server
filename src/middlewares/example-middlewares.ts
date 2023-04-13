import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class LoggerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any) {
    console.error(error);
    next(error);
  }
}
