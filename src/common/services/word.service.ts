import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/core/interface/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { EnvInterface } from 'src/core/interface/env.interface';
import { ConfigService } from '@nestjs/config';
import { WordCategories } from '../enums/categories.enum';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { LanguagesSupported } from 'src/core/enum/languages.enum';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Word } from '../interfaces/word.interface';

export interface WordAPI {
  word:     string;
  length:   number;
  category: string;
  language: string;
}

@Injectable()
export class WordService {

  private readonly urlApi: string;
  private readonly logger = new Logger('WordService');
  

  constructor(
    private readonly configService: ConfigService<EnvInterface>,
    private readonly httpService: HttpService
  ){
    this.urlApi = this.configService.get('WORD_API')!;
  }
  
  async getRandomWord(language : LanguagesSupported = LanguagesSupported.en, category: WordCategories = WordCategories.all ): Promise<Word> {

    const i18n = I18nContext.current<I18nTranslations>();
    
    const word = await firstValueFrom(
      this.httpService.get<WordAPI[]>(`${this.urlApi}?type=capitalized&words=1&language=${language}&category=${category}`)
      .pipe(
        map(res => {

          const data = (res.data && res.data.length > 0) ? res.data[0] : null;

          if(!data){
            throw new InternalServerErrorException(i18n?.t('exceptions.externalServiceError', {lang: language}));
          }

          return {
            word: data.word,
            category: i18n?.t<any>(`categories.${data.category}`) ?? ''
          }

        }), 
        catchError((error: AxiosError) => {
          this.logger.error(error?.response?.data);
          throw new InternalServerErrorException(i18n?.t('exceptions.externalServiceError'));
        }),
      ),
    );
    
    return word;
  }
}
