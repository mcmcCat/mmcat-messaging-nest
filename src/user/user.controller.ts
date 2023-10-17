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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('用户')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户', description: '创建一个新用户' })
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @ApiOperation({
    summary: '获取所有用户',
    description: '去获取数据库中所有用户',
  })
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: '获取用户ByUsername',
    description: '根据用户名来查找用户',
  })
  @Get()
  findOne(@Query('username') username) {
    return this.userService.findOne(username);
  }

  @ApiOperation({
    summary: '更新用户头像',
    description: '根据用户名来查找并且更新用户头像',
  })
  @Post('avatar')
  async uploadAvatar(@Body() body: UploadAvatarDto) {
    // eslint-disable-next-line prefer-const
    let { username, avatar } = body;

    if (avatar.length < 20) {
      avatar = `https://pic.616pic.com/ys_b_img/00/38/71/FNFS7W4sQe.jpg`;
    }
    const res = await this.userService.uploadAvatar(username, avatar);
    return res;
  }

  @ApiOperation({
    summary: '查看用户是否有头像',
    description: '根据用户名来查找查看用户是否有头像',
  })
  @Post('hasavatar')
  async hasAvatar(@Body() body: HasAvatarDto) {
    const { username } = body;
    const res = await this.userService.hasAvatar(username);
    return res;
  }
}
