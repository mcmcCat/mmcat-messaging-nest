import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Socket } from 'socket.io';

const roomList = {};
let roomId = null;
let user = '';
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
  // 保存房间成员列表的对象
  @WebSocketServer()
  socketIO: Socket; //它表示整个 WebSocket 服务器的实例。它可以用于执行全局操作，如向所有连接的客户端广播消息或将客户端连接到特定的房间。

  @SubscribeMessage('joinRoom') // 将事件名称改为 'connect'
  joinRoom(client: Socket, data: { roomId: string; user: string }) {
    roomId = data.roomId;
    user = data.user;
    // 将用户添加到列表的对应房间号中
    if (!roomList[roomId]) {
      roomList[roomId] = [];
    }
    if (!roomList[roomId].includes(user)) {
      roomList[roomId].push(user);
    }

    // 在加入房间的客户端上设置room属性，方便后续判断
    (client as any).room = roomId;

    // 加入房间
    client.join(roomId);

    console.log(roomList, 'join');
    console.log(client.rooms, 'join'); // Set { <socket.id>, "room1" }

    // 通知房间内人员
    this.socketIO
      .to(roomId)
      .emit('sys', `${user}加入了房间`, roomId, roomList[roomId]);
  }

  @SubscribeMessage('leave')
  leave(client: Socket) {
    // 从房间名单中移除
    const index = roomList[roomId].indexOf(user);
    if (index !== -1) {
      roomList[roomId].splice(index, 1);
    }

    client.leave(roomId); // 退出房间
    (client as any).room = '';

    // 通知房间内人员
    this.socketIO
      .to(roomId)
      .emit('sys', `${user}退出了房间`, roomId, roomList[roomId]);

    console.log(user + '退出了房间：' + roomId);

    return;
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket) {
    // 将该消息广播给其他客户端
    client.broadcast.emit('showMessage');
    // 将消息发送给当前连接的客户端
    client.emit('showMessage');
    return;
  }

  @SubscribeMessage('sendRoomMessage')
  sendRoomMessage(client: Socket, data) {
    console.log('服务端接收到了');

    // // 将该消息广播给其他客户端
    client.emit('sendRoomMessage', data);
    // // 将消息发送给当前连接的客户端
    client.to(roomId).emit('sendRoomMessage', data);
    return;
  }

  @SubscribeMessage('connection')
  connection(client: Socket, data) {
    console.log('有一个客户端连接成功', client.id);

    client.on('disconnect', () => {
      console.log('有一个客户端断开连接', client.id);
      // 处理断开连接的额外逻辑
    });
    return;
  }

  // @SubscribeMessage('sendRoomMessage')
  // sendRoomMessage(client: Socket, data: { to: string }) {
  //   // 将该消息广播给其他客户端
  //   client.broadcast.emit('showMessage');
  //   // 将消息发送给当前连接的客户端
  //   client.emit('showMessage');
  //   return;
  // }

  // @SubscribeMessage('ToClient')
  // ToClient(@MessageBody() data: any) {
  //   // 转发信息
  //   const forwardMsg: string = '服务端=>客户端';
  //   return {
  //     //通过return返回客户端转发事件
  //     event: 'forward',
  //     data: forwardMsg, //data后面跟携带数据
  //   };
  // }

  // //接收并处理来自客户端的消息
  // @SubscribeMessage('toServer')
  // handleServerMessage(client: Socket, data: string) {
  //   console.log(data + ' （让我服务端来进行一下处理）');
  //   client.emit('ToClient', data + '（处理完成给客户端）');
  // }
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
