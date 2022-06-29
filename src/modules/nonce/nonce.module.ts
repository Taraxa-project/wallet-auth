import { Module } from '@nestjs/common';
import NonceService from './nonce.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import UserNonceEntity from './entities/userNonce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserNonceEntity])],
  controllers: [],
  providers: [NonceService],
  exports: [NonceService],
})
export class NonceModule {}
