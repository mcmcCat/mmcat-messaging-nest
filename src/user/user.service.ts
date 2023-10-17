import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  create(body: CreateUserDto) {
    const data = new User();
    data.username = body.username;
    data.password = body.password;
    data.avatar = body.avatar;
    return this.user.save(data);
  }

  async findAll() {
    const res = await this.user.find();
    return res;
  }

  async findOne(username: string) {
    const res = await this.user.find({
      where: {
        username: Like(`%${username}%`),
      },
    });

    return res !== null ? res : null;
  }

  async uploadAvatar(username: string, avatar: string) {
    /* 
      await repository.update({ firstName: "Timber" }, { firstName: "Rizzrak" });
      相当于执行 UPDATE user SET firstName = Rizzrak WHERE firstName = Timber 
    */
    const res = await this.user.update(
      { username },
      {
        avatar,
      },
    );
    return {
      code: '200',
      msg: '更新头像成功',
      data: res,
    };
  }
  async hasAvatar(username: string) {
    const res = await this.user.find({
      where: {
        username: Like(`%${username}%`),
      },
    });
    return res[0].avatar !== null;
  }
}
