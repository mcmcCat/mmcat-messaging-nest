import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // @Column()
  // userId: number;

  // @Column()
  // username: string;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  sendTime: string;
}
