import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { Like, Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private authService: AuthService,
  ) {}

  async register(body) {
    // 拿到注册时的密码开始加密，hash密码字符串
    const hash = await bcryptjs.hashSync(body.password, 10);

    const isNotExist = await this.user.find({
      where: {
        username: Like(`%${body.username}%`),
      },
    });

    if (!isNotExist.length) {
      const data = new User();
      data.username = body.username;
      data.password = hash; // 将hash密码字符串插入到数据库中用户项的 password 中
      data.avatar = body.avatar;

      await this.user.save(data);

      return {
        code: '200',
        msg: '用户注册成功',
      };
    } else {
      return {
        code: '1001',
        msg: '该用户已经存在',
      };
    }
  }
  async login(body) {
    const authResult = await this.authService.validateUser(
      body.username,
      body.password,
    );

    //验证是否是有效用户
    if (authResult) {
      return this.authService.login(authResult);
    } else {
      return {
        code: '1002',
        msg: '请检查用户名或密码是否正确',
      };
    }
  }
}
