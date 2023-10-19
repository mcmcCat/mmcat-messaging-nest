/* eslint-disable prettier/prettier */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    // 这种方式注入麻烦，通过获取 appModule 实例来获取 userService、authService 
    // private readonly userService: UserService,
    // private readonly authService: AuthService
  ) {
    super();

  }

  async canActivate(context: ExecutionContext): Promise<any> {
    console.log('进入全局守卫');

    const req = context.switchToHttp().getRequest();
    // const res = context.switchToHttp().getResponse();

    /**
     * 如果是请求路由是白名单中的，则直接放行
     */
    if (this.hasUrl(this.whiteList, req.url)) return true;

    try {
      // 获取请求头中的 token 字段
      const accessToken = req.get('Authorization');
      if (!accessToken) throw new UnauthorizedException('请先登录');

      const app = await NestFactory.create<NestExpressApplication>(AppModule);
      const authService = app.get(AuthService);
      const userService = app.get(UserService);

      const tokenUserInfo = await authService.verifyToken(accessToken);
      console.log('tokeUserId ==>', tokenUserInfo);
      
      if (Object.keys(tokenUserInfo).length > 0) {
        const resData = await userService.findOne(tokenUserInfo.username);
        if (resData[0].id) return true;
      }
    } catch (e) {
      console.log('1h 的 token 过期啦！请重新登录');
      return false;
    }
  }
  // 白名单数组
  private whiteList: string[] = ['/auth/register','/auth/login'];

  // 验证该次请求是否为白名单内的路由
  private hasUrl(whiteList: string[], url: string): boolean {
    let flag = false;
    if (whiteList.indexOf(url) !== -1) {
      flag = true;
    }
    return flag;
  }
}
