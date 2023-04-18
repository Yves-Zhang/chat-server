import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import config from './server.config'
import registerControllers from './controllers'
import express from 'express'
import path from 'path'
import logger from './middleWares/logger'
import { limiter } from './middleWares/limiter'
import chalk from 'chalk'

const { port } = config

const app = registerControllers(createExpressServer, {
  routePrefix: "/api",
  middlewares: [],
})

// 日志
app.use(logger);
// 请求次数限制
app.use(limiter);

// 配置静态资源目录
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(chalk`{bold {gray Server is running on port:}} {bold {green http://localhost:${port}}}`)
});
