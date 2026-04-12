import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ResponseBuilder } from 'src/core/utils/response';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerDto } from '../dto';
import { Player } from '../entities';
import { GetRequestJwtPayload } from 'src/core/decorators/get-request-jwt-payload.decorator';
import type { JwtPayloadInterface } from 'src/core/interface/jwt.interface';
import { Auth } from 'src/core/decorators/auth.decorator';
import { GameSocketService } from 'src/websockets/game/game-socket.service';
import { PlayerService } from '../services/player.service';

@Controller('/game/player')
export class GamePlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly gameSocketService: GameSocketService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  //#region PLAYER NO AUTH

  @Get('/image/:id')
  async getPlayerImage(@Res() res, @Param('id', ParseUUIDPipe) id: string) {
    const result = await this.playerService.getImage(id);
    if (!result) return res.status(400).json(ResponseBuilder.buildNotSuccess());
    return res.sendFile(result);
  }

  //#endregion

  //#region PLAYER AUTH

  @Auth()
  @Get('/token')
  async getPlayerByToken(@GetRequestJwtPayload() payload: JwtPayloadInterface) {
    const result = await this.playerService.findOne(payload.playerId);

    if (!result) {
      throw new NotFoundException(this.i18n.t('entities.player.notFound'));
    }

    return ResponseBuilder.build<PlayerDto>(Player.toPlain(result));
  }

  @Auth()
  @Get('/:id')
  async getPlayer(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.playerService.findOne(id);

    if (!result) {
      throw new NotFoundException(this.i18n.t('entities.player.notFound'));
    }

    return ResponseBuilder.build<PlayerDto>(Player.toPlain(result));
  }

  @Auth()
  @Delete('/:id')
  async deletePlayer(
    @Param('id', ParseUUIDPipe) id: string,
    @GetRequestJwtPayload() payload: JwtPayloadInterface,
  ) {
    const result = await this.playerService.deletePlayer(id);

    if (!result) return ResponseBuilder.buildNotSuccess();

    await this.gameSocketService.emitGameStatus(payload.gameId);

    if (id === payload.playerId) {
      await this.gameSocketService.emitCloseGame(payload.gameId);
    } else {
      await this.gameSocketService.emitPlayerBanned(payload.gameId, id);
    }

    return ResponseBuilder.buildSuccess();
  }

  @Auth()
  @Post('/image/:id')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadPlayerImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(png|jpeg|jpg)$/,
          errorMessage: () => {
            const i18n = I18nContext.current<I18nTranslations>();
            throw new BadRequestException(i18n!.t('validation.fileValidation'));
          },
        })
        .build({
          fileIsRequired: true,
          exceptionFactory: () => {
            const i18n = I18nContext.current<I18nTranslations>();
            throw new BadRequestException(i18n!.t('validation.fileRequired'));
          },
        }),
    )
    file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this.playerService.uploadImage(id, file);
    if (!result) return ResponseBuilder.buildNotSuccess();
    return ResponseBuilder.buildSuccess();
  }

  //#endregion
}
