import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { AuthService } from 'src/common/services/auth.service';
import { VerifyGameDto, CreateJoinGameDto, CreateJoinWatcherDto } from '../dto';
import { GameService } from './game.service';
import { PlayerService } from './player.service';
import { JoinDto } from '../dto/join.dto';
import { Player } from '../entities';

@Injectable()
export class JoinService {
  constructor(
    @Inject(GameService) private readonly gameService: GameService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async verifyJoinGame(verifyGameDto: VerifyGameDto): Promise<boolean> {
    const { roomName, roomPassword } = verifyGameDto;

    const verified = await this.gameService.verifyJoinGame(roomName, roomPassword);

    return verified;
  }

  async joinGamePlayer(createJoinGameDto: CreateJoinGameDto): Promise<JoinDto> {
    try {
      const { roomName, roomPassword, playerName, host } = createJoinGameDto;

      const verified = await this.gameService.verifyJoinGame(roomName, roomPassword);

      if (!verified) {
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const game = await this.gameService.findOne(roomName);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      const player = await this.playerService.createPlayer(playerName, game.id, host);

      await this.gameService.updateGame(game.id, { roomPlayersJoined: game.roomPlayersJoined + 1 });

      return {
        player: Player.toPlain(player),
        token: this.authService.getJwtToken(game.id, player.id),
      };
    } catch (error) {
      ExceptionBuilder.handleException(error, JoinService.name);
    }
  }

  async joinGameWatcher(createJoinWatcherDto: CreateJoinWatcherDto): Promise<JoinDto> {
    try {
      const { roomName, roomPassword, host } = createJoinWatcherDto;

      const verified = await this.gameService.verifyJoinGame(roomName, roomPassword);

      if (!verified) {
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const game = await this.gameService.findOne(roomName);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if (!host && !game.overlay) {
        throw new BadRequestException(this.i18n.t('entities.game.noWatchers'));
      }

      const player = await this.playerService.createWatcher(game.id, host);

      return {
        player: Player.toPlain(player),
        token: this.authService.getJwtToken(game.id, player.id),
      };
    } catch (error) {
      ExceptionBuilder.handleException(error, JoinService.name);
    }
  }
}
