import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { LoginDTO } from './auth/dto/login.dto';

// @Controller装饰器来定义控制器,如每一个要成为控制器的类，都需要借助@Controller装饰器的装饰
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @ApiTags('JWT登录注册')
  @Post('auth/register')
  async AuthRegister(@Body() body: CreateUserDto) {
    return await this.appService.register(body);
  }

  @ApiTags('JWT登录注册')
  @Post('auth/login')
  async AuthLogin(@Body() body: LoginDTO) {
    return await this.appService.login(body);
  }
}
