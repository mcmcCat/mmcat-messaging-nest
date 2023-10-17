/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    default: 'mmcat',
    required: true,
  })
  username: string;

  @ApiProperty({
    default: 'haoshuai',
    required: true,
  })
  password: string;
}
