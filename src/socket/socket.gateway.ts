import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Socket } from 'socket.io';

@WebSocketGateway(3001, {
  allowEIO3: true, // 开启后要求前后端使用的 Socket.io 版本要保持一致
  //后端解决跨域
  cors: {
    // 允许具体源的请求进行跨域访问
    origin: 'http://localhost:8080', //这里不要写*，要写 true 或者具体的前端请求时所在的域，否则会出现跨域问题
    // 允许在跨域请求中发送凭据
    credentials: true,
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}
  msgList: string[] = [];
  // 保存房间成员列表的对象
  roomMembers = {};
  roomId = null;

  @SubscribeMessage('ToClient')
  ToClient(@MessageBody() data: any) {
    // 转发信息
    const forwardMsg: string = '服务端=>客户端';
    return {
      //通过return返回客户端转发事件
      event: 'forward',
      data: forwardMsg, //data后面跟携带数据
    };
  }

  //接收并处理来自客户端的消息
  @SubscribeMessage('toServer')
  handleServerMessage(client: Socket, data: string) {
    console.log(data + ' （让我服务端来进行一下处理）');
    client.emit('ToClient', data + '（处理完成给客户端）');
  }

  // 连接房间
  @SubscribeMessage('connect') // 将事件名称改为 'connect'
  handleConnection(client: Socket, data: string) {
    client.on('joinRoom', async (socketId: string, room: string) => {
      client.join(room);

      // 将客户端ID添加到房间成员列表中
      if (!this.roomMembers[room]) {
        this.roomMembers[room] = [];
      }
      if (!this.roomMembers[room].includes(socketId)) {
        this.roomMembers[room].push(socketId);
      }

      // 在加入房间的客户端上设置room属性，方便后续判断
      (client as any).room = room;
      console.log('client.room: ', (client as any).room);

      console.log('房间列表信息', this.roomMembers);
    });
  }

  // @SubscribeMessage('createSocket')
  // create(@MessageBody() createSocketDto: CreateSocketDto) {
  //   return this.socketService.create(createSocketDto);
  // }

  // @SubscribeMessage('findAllSocket')
  // findAll() {
  //   return this.socketService.findAll();
  // }

  // @SubscribeMessage('findOneSocket')
  // findOne(@MessageBody() id: number) {
  //   return this.socketService.findOne(id);
  // }

  // @SubscribeMessage('updateSocket')
  // update(@MessageBody() updateSocketDto: UpdateSocketDto) {
  //   return this.socketService.update(updateSocketDto.id, updateSocketDto);
  // }

  // @SubscribeMessage('removeSocket')
  // remove(@MessageBody() id: number) {
  //   return this.socketService.remove(id);
  // }
}
