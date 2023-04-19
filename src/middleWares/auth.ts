import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import wrapResponse from '../utils/wrapResponse'

export class auth implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {
    const chatkey = req.cookies?.chatkey
    const AUTH_SECRET_KEY = chatkey
    if (!AUTH_SECRET_KEY) {
      // throw new Error('Error: 无访问权限 | No access rights')
      res.send(wrapResponse({
        code: 1,
        success: false,
        message: 'Error: 无访问权限 | No access rights',
        data: null,
      }))
      return
    }
    next()
  }
}
