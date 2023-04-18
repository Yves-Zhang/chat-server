import { Middleware } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'

@Middleware({ type: 'before' })
export class auth {
  use(req: Request, _: Response, next: NextFunction) {
    const chatkey = req.cookies.chatkey
    const AUTH_SECRET_KEY = chatkey
    if (!AUTH_SECRET_KEY) {
      throw new Error('Error: 无访问权限 | No access rights')
    }
    next()
  }
}
