import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import logger from './middleWares/logger';
import config from './server.config'
import controllers from './controllers'
import express from 'express';
import path from 'path';

const { port } = config

const app = createExpressServer({
  controllers: [...controllers]
});

app.use(logger);

// 配置静态资源目录
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`)
});
