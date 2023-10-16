/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadAvatarDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'mmcat',
    description: '创建用户姓名',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'tttt',
  })
  avatar: string;
}
