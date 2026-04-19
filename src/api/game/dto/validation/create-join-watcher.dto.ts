import { IsString, MinLength, IsNotEmpty, IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateJoinWatcherDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', { constraints: [3] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  roomName!: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', { constraints: [3] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  roomPassword!: string;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  host!: boolean;
}
