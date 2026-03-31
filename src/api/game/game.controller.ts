import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, BadRequestException, Res } from '@nestjs/common';
import { ResponseBuilder } from 'src/core/utils/response';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { GameService, JoinService, PlayerService } from './services';
import { GameDto, CreateGameDto, UpdateGameDto, VerifyGameDto, CreateJoinGameDto, PlayerDto } from './dto';
import { Game, Player } from './entities';
import { JoinDto } from './dto/join.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly joinService: JoinService,
    private readonly userService: PlayerService, 
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  //#region GAME REGION

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    const result = await this.gameService.findOne(id);

    if(!result){
      throw new NotFoundException(this.i18n.t('entities.game.notFound'));
    }

    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const result = await this.gameService.create(createGameDto);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto) {
    const result = await this.gameService.update(id, updateGameDto)
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.gameService.remove(id);

    if(!result) return ResponseBuilder.buildNotSuccess();

    return ResponseBuilder.buildSuccess();
  }

  //#endregion

  //#region JOIN REGION

  @Post('join/verify')
  async verifyJoinGame(@Body() verifyGameDto: VerifyGameDto) {

    const result = await this.joinService.verifyJoinGame(verifyGameDto);

    if(result){
      return ResponseBuilder.buildSuccess();
    }else{
      return ResponseBuilder.buildNotSuccess()
    }

  }

  @Post('join')
  async joinGame(@Body() createJoinGameDto: CreateJoinGameDto) {
    const result = await this.joinService.joinGame(createJoinGameDto)
    return ResponseBuilder.build<JoinDto>(result);
  }

  //#endregion

  //#region PLAYER REGION

  @Get('player/:id')
  async getPlayer(@Param('id', ParseUUIDPipe) id: string) {
    
    const result = await this.userService.findOne(id);

    if(!result){
      throw new NotFoundException(this.i18n.t('entities.player.alreadyExist'));
    }
    
    return ResponseBuilder.build<PlayerDto>(Player.toPlain(result));
  }

  @Delete('player/:id')
  async deletePlayer(@Param('id', ParseUUIDPipe) id: string) {

    const result = await this.userService.remove(id);

    if(!result) return ResponseBuilder.buildNotSuccess();

    return ResponseBuilder.buildSuccess();
  }

  @Get('player/image/:id')
  async getPlayerImage(@Res() res, @Param('id', ParseUUIDPipe) id: string) {
    const result = await this.userService.getImage(id);
    if(!result) return res.status(400).json(ResponseBuilder.buildNotSuccess());
    return res.sendFile(result);
  }

  @Post('player/image/:id')
  @UseInterceptors(FileInterceptor('file', {limits : {files: 1}}))
  async uploadPlayerImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType : /^image\/(png|jpeg|jpg)$/,
        errorMessage : () => {
          const i18n = I18nContext.current<I18nTranslations>();
          throw new BadRequestException(i18n!.t('validation.fileValidation'));
        }
      })
      .build({
        fileIsRequired : true,
        exceptionFactory: () => {
          const i18n = I18nContext.current<I18nTranslations>();
          throw new BadRequestException(i18n!.t('validation.fileRequired'));
        }
      })
    ) file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    const result = await this.userService.uploadImage(id, file);
    if(!result) return ResponseBuilder.buildNotSuccess();
    return ResponseBuilder.buildSuccess();
  }

  //#endregion
}
