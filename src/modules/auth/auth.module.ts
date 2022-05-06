import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../nonce/entities/user.entity';
import UserNonceEntity from '../nonce/entities/userNonce.entity';
import { NonceModule } from '../nonce/nonce.module';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    NonceModule,
    TypeOrmModule.forFeature([AuthEntity, UserEntity, UserNonceEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: { expiresIn: `${configService.get('auth.tokenExpiry')}s` },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
