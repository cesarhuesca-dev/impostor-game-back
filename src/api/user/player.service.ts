import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { Game } from '../game/entities/game.entity';
import { isUUID } from 'class-validator';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PlayerService {
  
  constructor(
    @InjectRepository(Player) private readonly playerRepository : Repository<Player>,
    @InjectRepository(Game) private readonly gameRepository : Repository<Game>,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  
  async findOne(term: string): Promise<Player | null> {
    try {
  
      let player : Player | null = null;

      if(isUUID(term)){
        player = await this.playerRepository.findOneBy({ id : term.trim() });
      }else{
        player = await this.playerRepository.findOneBy({ name: term.trim() });
      }

      return player;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }
  
  async createPlayer(playerName: string, gameId: string): Promise<Player>{

    try {

      const exist = await this.findOne(playerName)

      if(exist){
        throw new BadRequestException(this.i18n.t('entities.player.alreadyExist'));
      }

      const objCreate = this.playerRepository.create({
        name: playerName.trim(),
        game: await this.gameRepository.preload({id: gameId})
      })

      const player = await this.playerRepository.save(objCreate);

      return player;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }

  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      await this.playerRepository.delete(id);
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }
}
