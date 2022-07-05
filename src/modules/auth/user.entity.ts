import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { IUser } from '../../models';

export const tableName = 'user';

@Entity(tableName)
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty()
  @IsString()
  publicAddress!: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsNumber()
  nonce!: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
