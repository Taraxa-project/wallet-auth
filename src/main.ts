import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export function getPort(): number {
  return parseInt(process.env.PORT || process.env.SERVER_PORT || '3003', 10);
}

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const PORT = getPort();
  
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Taraxa Auth Backend')
    .setDescription('Taraxa Auth Backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  if(!!process.env.GLOBAL_PREFIX) {
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Type', 'Content-Range'],
  });
  await app.listen(PORT);
  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
