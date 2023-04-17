import { rateLimit } from 'express-rate-limit'
import { Request, Response } from 'express'

// 一分钟限制请求30次
const maxCount = 30

export const limiter = rateLimit({
  windowMs: 60 * 1000, // Maximum number of accesses within an hour
  max: maxCount,
  statusCode: 200, // 200 means success，but the message is 'Too many request from this IP in 1 hour'
  message: async (req: Request, res: Response) => {
    res.send({ status: 'Fail', message: 'Too many request from this IP in 1 hour', data: null })
  },
})
