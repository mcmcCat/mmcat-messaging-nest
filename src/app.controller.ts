import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller装饰器来定义控制器,如每一个要成为控制器的类，都需要借助@Controller装饰器的装饰
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get是请求方法的装饰器，对getHello方法进行修饰， 表示这个方法会被GET请求调用。
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
