/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class findMessageListDTO {
  @ApiProperty({
    default: 'mmcat',
    description: '消息发送者',
    example: 'mmcat',
    required: true,
  })
  username: string;

  @ApiProperty({
    default: 'qqfish',
    description: '当前聊天对象',
    example: 'qqfish',
    required: true,
  })
  currentChater: string;
}
