import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { AuthService } from 'src/common/services/auth.service';
import { VerifyGameDto, CreateJoinGameDto } from '../dto';
import { GameService } from './game.service';
import { PlayerService } from './player.service';

@Injectable()
export class JoinService {

  constructor(
    @Inject(GameService) private readonly gameService: GameService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly i18n: I18nService<I18nTranslations>
  ){}
  
  async verifyJoinGame(verifyGameDto: VerifyGameDto): Promise<boolean> {

    const { roomName, roomPassword } = verifyGameDto;

    const verified = await this.gameService.verifyJoinGame(roomName, roomPassword);

    return verified;
  }

  async joinGame(createJoinGameDto: CreateJoinGameDto): Promise<string> {

    try {
      
      const { roomName, roomPassword, playerName } = createJoinGameDto;

      const verified = await this.gameService.verifyJoinGame(roomName, roomPassword);

      if(!verified){
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const game = await this.gameService.findOne(roomName);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      const player =  await this.playerService.createPlayer(playerName, game.id);

      await this.gameService.update(game.id, { roomPlayersJoined: (game.roomPlayersJoined + 1) });

      return this.authService.getJwtToken(game.id, player.id);

    } catch (error) {
      ExceptionBuilder.handleException(error, 'JoinService');
    }
  }

  
  


}
