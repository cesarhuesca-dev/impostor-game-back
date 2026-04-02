import { Controller, Get, Param, ParseUUIDPipe, NotFoundException, Post, Body, Patch, Delete } from '@nestjs/common';
import { ResponseBuilder } from 'src/core/utils/response';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { GameDto, CreateGameDto, UpdateGameDto } from '../dto';
import { Game, Player } from '../entities';
import { I18nService } from 'nestjs-i18n';
import { GameService, PlayerService } from '../services';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  //#region GAME REGION

  @Auth()
  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    const resultGame = await this.gameService.findOne(id);

    if(!resultGame){
      throw new NotFoundException(this.i18n.t('entities.game.notFound'));
    }

    const resultPlayers = await this.playerService.findPlayersByGame(resultGame.id);

    const playersDto = resultPlayers.map(x => Player.toPlain(x, false))


    return ResponseBuilder.build<GameDto>(Game.toPlain(resultGame, playersDto));
  }

  @Post('/')
  async create(@Body() createGameDto: CreateGameDto) {
    const result = await this.gameService.create(createGameDto);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Auth()
  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto) {
    const result = await this.gameService.update(id, updateGameDto)
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Auth()
  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.gameService.remove(id);

    if(!result) return ResponseBuilder.buildNotSuccess();

    return ResponseBuilder.buildSuccess();
  }

}
