import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import auth from './config/auth';
import db, { generalConfig } from './config/db';
import { AuthModule } from './modules/auth';
import { NonceModule } from './modules/nonce/nonce.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      isGlobal: true,
      load: [generalConfig, db, auth],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(db)],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host') || '127.0.0.1',
        port: configService.get<number>('db.port') || 5432,
        username: configService.get<string>('db.user') || 'postgres',
        password: configService.get<string>('db.pass') || 'postgres',
        database: configService.get<string>('db.name') || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    NonceModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
