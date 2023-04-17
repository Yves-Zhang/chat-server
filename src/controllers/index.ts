import fs from 'fs'
import path from 'path'
import { RoutingControllersOptions } from 'routing-controllers';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 自动扫描指定目录下的所有文件
const controllerPath = path.join(__dirname)

const Controllers: any[] = []

fs.readdirSync(controllerPath).forEach((file: string) => {
  // 如果文件名以 "Controller.js" 结尾，则认为是控制器文件
  if (file.endsWith('Controller.ts')) {
    // 动态引入控制器模块
    const Module = require(path.join(controllerPath, file))

    let controller;
    if (Module.default) {
      controller = Module.default
    } else {
      const moduleName: unknown = capitalizeFirstLetter(file.split('.')[0])
      controller = Module[(moduleName as string)];
    }

    // 注册控制器到 Typedi 容器
    Controllers.push(controller);
  }
});

export default function registerControllers(server: { (options?: RoutingControllersOptions | undefined): any; (arg0: { controllers: any[]; }): any; }, configs?: RoutingControllersOptions | undefined){
  return server({
    controllers: [...Controllers],
    ...configs
  });
}

