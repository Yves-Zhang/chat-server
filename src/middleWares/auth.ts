import { isNotEmptyString } from '../utils/is'
import { Request, Response, NextFunction } from 'express';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const AUTH_SECRET_KEY = ''
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
      if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
        throw new Error('Error: 无访问权限 | No access rights')
      next()
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
      }
    }
  }
  else {
    next()
  }
}
