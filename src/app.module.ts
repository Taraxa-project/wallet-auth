import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import auth from './config/auth';
import db, { generalConfig } from './config/db';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { AuthModule } from './modules/auth/auth.module';

const getEnvFilePath = () => {
  const pathsToTest = ['../.env'];

  for (const pathToTest of pathsToTest) {
    const resolvedPath = resolve(__dirname, pathToTest);

    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }
  }
};

export const entities: Function[] = [];

const WalletAuthTypeOrmModule = () => {
  let typeOrmOptions: TypeOrmModuleOptions;
  const baseConnectionOptions: TypeOrmModuleOptions = process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities,
        synchronize: !!process.env.TYPEORM_SYNC,
        autoLoadEntities: true,
        logging: ['info'],
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'wallet',
        entities,
        synchronize: !!process.env.TYPEORM_SYNC,
        autoLoadEntities: true,
        logging: ['info'],
      };

  if (!!process.env.DATABASE_CERT) {
    typeOrmOptions = {
      ...baseConnectionOptions,
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.DATABASE_CERT,
      },
    };
  } else {
    typeOrmOptions = { ...baseConnectionOptions };
  }
  return TypeOrmModule.forRoot(typeOrmOptions);
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
      load: [generalConfig, db, auth],
    }),
    WalletAuthTypeOrmModule(),
    AuthModule,
  ],
})
export class AppModule {}
