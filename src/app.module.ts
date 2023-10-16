import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      host: 'localhost', //host
      port: 3306,
      username: 'root', //账号
      password: '123456', //密码
      database: 'nest', //库名
      entities: [],
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库，实体类如果定义好了设置为false不然会导致实体的强替换，清空修改过的属性列中的数据
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
