import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'mmcat',
    description: '创建用户姓名',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'haoshuai',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'https://pic.616pic.com/ys_b_img/00/38/71/FNFS7W4sQe.jpg',
  })
  avatar: string;
}
