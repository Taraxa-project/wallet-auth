import UserEntity from 'src/modules/nonce/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  signature: string;

  @ManyToOne(() => UserEntity, (user) => user.auths)
  user: UserEntity;
}
