import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nAsyncOptions, I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import { AcceptLanguageResolver, HeaderResolver, QueryResolver } from 'nestjs-i18n';

import * as path from 'path';
import { EnvInterface } from '../interface/env.interface';

const i18nSchema = (configService: ConfigService<EnvInterface>): I18nOptionsWithoutResolvers => {
  return {
    fallbackLanguage: configService.get('FALLBACK_LANGUAGE')!,
    loaderOptions: {
      path: path.join(__dirname, '/../../i18n/'),
      watch: true,
      includeSubfolders: true
    },
    typesOutputPath: path.join(__dirname, '../../../src/i18n/generated/i18n.generated.ts')
  };
};

export const i18nOptions: I18nAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => i18nSchema(configService),
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
    new HeaderResolver(['x-lang'])
  ]
};
