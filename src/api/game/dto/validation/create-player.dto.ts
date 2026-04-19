import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreatePlayerDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', { constraints: [3] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  name!: string;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  host!: boolean;
}
