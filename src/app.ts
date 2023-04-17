import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import config from './server.config'
import registerControllers from './controllers'
import express from 'express'
import path from 'path'
import logger from './middleWares/logger'
import { limiter } from './middleWares/limiter'

const { port } = config

const app = registerControllers(createExpressServer, { routePrefix: "/api" })
app.use(logger, limiter);

// 配置静态资源目录
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`)
});
