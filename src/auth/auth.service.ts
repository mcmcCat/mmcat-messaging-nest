import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user[0]) {
      // 对比输入的密码是否与存储的密码哈希匹配
      const passwordCompare = await bcryptjs.compareSync(
        password,
        user[0].password,
      );

      //https://docs.nestjs.com/security/encryption-and-hashing#encryption
      if (user[0] && passwordCompare) {
        const { password, ...result } = user[0];

        return result;
      }
      return null;
    } else {
      return null;
    }
  }

  async login(user: any) {
    // 准备jwt需要的负载
    const payload = { username: user.username, sub: user.id };
    return {
      code: '200',
      access_token: this.jwtService.sign(payload), // 配合存储着用户信息的负载 payload 来生成一个包含签名的JWT令牌(access_token)。。
      msg: '登录成功',
    };
  }

  // 认证token是否合法
  async verifyToken(token: string): Promise<any> {
    try {
      if (!token) return false;
      const tokenUserInfo = this.jwtService.verify(
        token.replace('Bearer ', ''),
      );

      return tokenUserInfo;
    } catch (e) {
      console.log('token不合法 或者 1h的token过期！！！');
      return false;
    }
  }
}
