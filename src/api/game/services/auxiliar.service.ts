import { Injectable } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nContext } from 'nestjs-i18n';
import { WordCategories } from 'src/common/enums/categories.enum';
import { ItemListInterface } from 'src/common/interfaces/list.interface';
import { LanguagesSupported } from 'src/core/enum/languages.enum';

@Injectable()
export class AuxiliarService {
  getCategories(): ItemListInterface[] {
    try {
      const i18n = I18nContext.current<I18nTranslations>();
      const i18nLang = (i18n?.lang as LanguagesSupported) ?? LanguagesSupported.en;

      const categories: ItemListInterface[] = Object.keys(WordCategories).map((category) => ({
        label:
          i18n?.t<any>(`categories.${category}`, { lang: i18nLang }) ?? WordCategories[category],
        value: WordCategories[category],
      }));

      return categories;
    } catch (error) {
      ExceptionBuilder.handleException(error, AuxiliarService.name);
    }
  }

  getLanguages(): ItemListInterface[] {
    try {
      const i18n = I18nContext.current<I18nTranslations>();
      const i18nLang = (i18n?.lang as LanguagesSupported) ?? LanguagesSupported.en;

      const languages: ItemListInterface[] = Object.keys(LanguagesSupported).map((lng) => ({
        label: i18n?.t<any>(`languages.${lng}`, { lang: i18nLang }) ?? LanguagesSupported[lng],
        value: LanguagesSupported[lng],
      }));

      return languages;
    } catch (error) {
      ExceptionBuilder.handleException(error, AuxiliarService.name);
    }
  }
}
