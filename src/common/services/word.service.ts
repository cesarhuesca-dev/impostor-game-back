import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { EnvInterface } from 'src/core/interface/env.interface';
import { ConfigService } from '@nestjs/config';
import { WordCategories } from '../enums/categories.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LanguagesSupported } from 'src/core/enum/languages.enum';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Word } from '../interfaces/word.interface';

export interface WordAPI {
  word: string;
  length: number;
  category: string;
  language: string;
}

@Injectable()
export class WordService {
  private readonly urlApi: string;
  private readonly logger = new Logger('WordService');

  constructor(
    private readonly configService: ConfigService<EnvInterface>,
    private readonly httpService: HttpService,
  ) {
    this.urlApi = this.configService.get('WORD_API')!;
  }

  async getRandomWord(
    language: LanguagesSupported = LanguagesSupported.en,
    category: WordCategories = WordCategories.all,
  ): Promise<Word> {
    const i18n = I18nContext.current<I18nTranslations>();
    const maxRetries = 2;
    const ogLang = language;

    if (language === LanguagesSupported.pt) {
      language = 'pt-r' as LanguagesSupported;
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await firstValueFrom(
          this.httpService.get<WordAPI[]>(
            `${this.urlApi}?type=capitalized&words=1&language=${language}&category=${category}`,
          ),
        );

        const { status, data } = res;
        const word = data && data.length > 0 ? data[0] : null;

        if (status !== 200) {
          throw new InternalServerErrorException(
            i18n?.t('exceptions.externalServiceError', { lang: ogLang }),
          );
        }

        if (word) {
          return {
            word: word.word,
            category: i18n?.t<any>(`categories.${word.category}`, { lang: ogLang }) ?? '',
          };
        }

        language = LanguagesSupported.en;
      } catch (error) {
        this.logger.error(error);
      }
    }

    throw new InternalServerErrorException(i18n?.t('exceptions.externalServiceError'));
  }
}
