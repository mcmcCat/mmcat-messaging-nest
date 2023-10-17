import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'mmcat',
    description: '创建用户名',
  })
  username: string;

  @ApiProperty({
    default: '123456',
  })
  password: string;

  @ApiProperty({
    default: 'https://pic.616pic.com/ys_b_img/00/38/71/FNFS7W4sQe.jpg',
  })
  avatar: string;
}
