import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    default: 'Hello',
    description: '消息内容',
    example: 'Hello',
    required: true,
  })
  content: string;

  @ApiProperty({
    default: 'mmcat',
    description: '消息发送者',
    example: 'mmcat',
    required: true,
  })
  sender: string;

  @ApiProperty({
    default: 'qqfinsh',
    description: '消息接收者',
    example: 'qqfinsh',
    required: true,
  })
  receiver: string;
}
