import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity('user_nonces')
export default class UserNonceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nonce: number;

  @ManyToOne(() => UserEntity, (user) => user.nonces)
  user: UserEntity;
}
