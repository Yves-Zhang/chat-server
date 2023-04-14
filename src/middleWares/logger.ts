import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on('finish', async () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(
      chalk`{gray [${new Date().toISOString()}]} {bold ${req.method}} {cyan ${req.url}} {yellow ${JSON.stringify(req.query)}} {magenta ${JSON.stringify(req.body)}} {bold ${res.statusCode}} - {green ${responseTime} ms}`
    );
  });
  next();
};

export default logger;