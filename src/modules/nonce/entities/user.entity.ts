import { AuthEntity } from 'src/modules/auth/entity/auth.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserNonceEntity from './userNonce.entity';

@Entity('user')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 64, unique: true, nullable: false })
  address: string;

  @Column({
    unique: true,
    nullable: true,
  })
  nonce: number;

  @OneToMany(() => AuthEntity, (auth) => auth.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  auths: AuthEntity[];

  @OneToMany(() => UserNonceEntity, (userNonce) => userNonce.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  nonces: UserNonceEntity[];
}
