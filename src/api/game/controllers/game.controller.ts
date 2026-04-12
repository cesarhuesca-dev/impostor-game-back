import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Post,
  Body,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ResponseBuilder } from 'src/core/utils/response';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { GameDto, CreateGameDto, UpdateGameDto } from '../dto';
import { Game, Player } from '../entities';
import { I18nService } from 'nestjs-i18n';
import { Auth, AuthHost } from 'src/core/decorators/auth.decorator';
import { GetRequestJwtPayload } from 'src/core/decorators/get-request-jwt-payload.decorator';
import { GameSocketService } from 'src/websockets/game/game-socket.service';
import type { JwtPayloadInterface } from 'src/core/interface/jwt.interface';
import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly socketService: GameSocketService,
  ) {}

  //#region GAME NO AUTH

  @Post('/')
  async createGame(@Body() createGameDto: CreateGameDto) {
    const result = await this.gameService.createGame(createGameDto);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  // @Auth()
  @Delete('/:id')
  async deleteGame(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.gameService.deleteGame(id);

    if (!result) return ResponseBuilder.buildNotSuccess();

    await this.socketService.emitCloseGame(id);
    return ResponseBuilder.buildSuccess();
  }

  //#endregion

  //#region GAME AUTH

  @Auth()
  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const resultGame = await this.gameService.findOne(id);

    if (!resultGame) {
      throw new NotFoundException(this.i18n.t('entities.game.notFound'));
    }

    const resultPlayers = await this.playerService.findPlayersByGame(resultGame.id);

    const playersDto = resultPlayers.map((x) => Player.toPlain(x, false));

    return ResponseBuilder.build<GameDto>(Game.toPlain(resultGame, playersDto));
  }

  //#endregion

  //#region GAME HOST

  @AuthHost()
  @Post('/start')
  async startGame(@GetRequestJwtPayload() payload: JwtPayloadInterface) {
    const { gameId } = payload;

    const result = await this.gameService.startGame(gameId);

    if (!result) return ResponseBuilder.buildNotSuccess();

    await this.socketService.emitGameStatus(gameId);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @AuthHost()
  @Post('/end')
  async endGame(@GetRequestJwtPayload() payload: JwtPayloadInterface) {
    const { gameId } = payload;

    const result = await this.gameService.endGame(gameId);

    if (!result) return ResponseBuilder.buildNotSuccess();

    await this.socketService.emitGameStatus(gameId);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @AuthHost()
  @Post('/round')
  async nextRound(
    @Body() updateGameDto: UpdateGameDto,
    @GetRequestJwtPayload() payload: JwtPayloadInterface,
  ) {
    const { word } = updateGameDto;
    const { gameId } = payload;

    const resultWord = await this.gameService.newRound(gameId, word);

    if (!resultWord) return ResponseBuilder.buildNotSuccess();

    await this.socketService.emitGameStatus(gameId);
    return ResponseBuilder.build<GameDto>(Game.toPlain(resultWord));
  }

  @AuthHost()
  @Post('/word')
  async changeWord(
    @Body() updateGameDto: UpdateGameDto,
    @GetRequestJwtPayload() payload: JwtPayloadInterface,
  ) {
    const { word } = updateGameDto;
    const { gameId } = payload;

    const resultWord = await this.gameService.changeWord(gameId, word);

    if (!resultWord) return ResponseBuilder.buildNotSuccess();

    await this.socketService.emitGameStatus(gameId);
    return ResponseBuilder.build<GameDto>(Game.toPlain(resultWord));
  }

  @AuthHost()
  @Patch('/:id')
  async updateGame(@Param('id', ParseUUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto) {
    const result = await this.gameService.updateGame(id, updateGameDto);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @AuthHost()
  @Patch('/:id/category')
  async updateGameCategory(
    @Param('id', ParseUUIDPipe) idGame: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    const { category } = updateGameDto;

    if (!category) {
      throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
    }

    const result = await this.gameService.changeCategory(idGame, category);
    await this.socketService.emitGameStatus(idGame);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  //#endregion
}
