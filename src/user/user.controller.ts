import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { HasAvatarDto } from './dto/has-avatar.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get()
  findOne(@Query('username') username) {
    return this.userService.findOne(username);
  }

  @Post('avatar')
  async uploadAvatar(@Body() body: UploadAvatarDto) {
    // eslint-disable-next-line prefer-const
    let { username, avatar } = body;

    // if (avatar.length < 20) {
    //   // avatar = `https://pic.616pic.com/ys_b_img/00/38/71/FNFS7W4sQe.jpg`;
    // }
    const res = await this.userService.uploadAvatar(username, avatar);
    return res;
  }

  @Post('hasavatar')
  async hasAvatar(@Body() body: HasAvatarDto) {
    const { username } = body;
    const res = await this.userService.hasAvatar(username);
    return res;
  }
}
