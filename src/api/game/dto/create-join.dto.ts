import { IsString, MinLength, IsNotEmpty, IsBoolean } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { VerifyGameDto } from "./verify-game.dto";

export class CreateJoinGameDto extends VerifyGameDto {

  @IsString({ message: i18nValidationMessage('validation.isString')})
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.minLength', {constraints: [4]})})
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  playerName:string;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean', { property: 'host' }) })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', { property: 'host' }) })
  host: boolean;

}
