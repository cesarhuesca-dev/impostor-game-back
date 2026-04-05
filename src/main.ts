import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './core/config';
import { Logger } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { CustomExceptionFilter } from './core/filters/exception.filter';
import { I18nCustomValidationExceptionFilter } from './core/filters/i18n-validation-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap', { timestamp: true });
  const env = envs();

  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new CustomExceptionFilter(),
    new I18nValidationExceptionFilter({ detailedErrors: false }),
    new I18nCustomValidationExceptionFilter()
  );
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.enableCors({origin: env.HOST_FRONT})

  await app.listen(env.SERVER_PORT);
  logger.log(`Server running on port ${env.SERVER_PORT}`);
}

void (async () => await bootstrap())();
