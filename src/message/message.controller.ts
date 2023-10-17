import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { findMessageListDTO } from './dto/find-messageList.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('消息')
@Controller('message')
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async create(@Body() body: CreateMessageDto) {
    return await this.messageService.create(body);
  }
  @Post('list')
  async findAll(@Body() body: findMessageListDTO) {
    return await this.messageService.findMessageList(body);
  }
}
