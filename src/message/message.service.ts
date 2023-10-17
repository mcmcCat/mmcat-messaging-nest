import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private message: Repository<Message>,
  ) {}

  async create(body: CreateMessageDto) {
    const data = new Message();
    data.content = body.content;
    data.sender = body.sender;
    data.receiver = body.receiver;

    await this.message.save(data);

    return {
      code: '200',
      msg: '发送成功',
    };
  }

  async findMessageList(findMessageListObj) {
    // 第一次查询是根据 findMessageListObj 中的用户名和当前聊天对象进行查询，以获取当前用户向该聊天对象发送的所有消息。
    const res1 = await this.message.find({
      where: {
        sender: Like(`%${findMessageListObj.username}%`),
        receiver: Like(`%${findMessageListObj.currentChater}%`),
      },
    });
    // 第二次查询是根据当前聊天对象和用户名进行查询，以获取该聊天对象向当前用户发送的所有消息。
    const res2 = await this.message.find({
      where: {
        sender: Like(`%${findMessageListObj.currentChater}%`),
        receiver: Like(`%${findMessageListObj.username}%`),
      },
    });
    return {
      code: '200',
      msg: '查询成功',
      data: {
        messageList: [...res1, ...res2].sort((a, b) => a.id - b.id),
      },
    };
  }
}
