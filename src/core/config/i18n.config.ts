import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CookieResolver,
  I18nAsyncOptions,
  I18nOptionsWithoutResolvers,
  I18nResolver,
} from 'nestjs-i18n';
import { AcceptLanguageResolver, HeaderResolver, QueryResolver } from 'nestjs-i18n';

import * as path from 'path';
import { EnvInterface, EnvironmentMode } from '../interface/env.interface';
import { Settings } from '../interface/settings.interface';
import { Request } from 'express';
import { ExecutionContext } from '@nestjs/common';

const i18nSchema = (configService: ConfigService<EnvInterface>): I18nOptionsWithoutResolvers => {
  const objI18n: I18nOptionsWithoutResolvers = {
    fallbackLanguage: configService.get('FALLBACK_LANGUAGE')!,
    loaderOptions: {
      path: path.join(__dirname, '/../../i18n/'),
      watch: true,
      includeSubfolders: true,
    },
  };

  if (configService.get('ENVIRONMENT')! === EnvironmentMode.Development) {
    objI18n.typesOutputPath = path.join(__dirname, '../../../src/i18n/generated/i18n.generated.ts');
  }

  return objI18n;
};

class CustomCookieResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | string[] {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const raw = request.cookies?.settings;

      if (typeof raw !== 'string') {
        return process.env.FALLBACK_LANGUAGE ?? 'en';
      }

      const settings: Settings = JSON.parse(raw);

      return settings.language;
    } catch {
      return process.env.FALLBACK_LANGUAGE ?? 'en';
    }
  }
}

export const i18nOptions: I18nAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => i18nSchema(configService),
  resolvers: [
    new CookieResolver(),
    new CustomCookieResolver(),
    new HeaderResolver(['x-lang']),
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
  ],
};
