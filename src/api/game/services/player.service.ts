import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { FilesService } from 'src/common/services/files.service';
import { Game, Player } from '../entities';
import { UpdatePlayerDto } from '../dto';

@Injectable()
export class PlayerService {
  
  constructor(
    @InjectRepository(Player) private readonly playerRepository : Repository<Player>,
    @InjectRepository(Game) private readonly gameRepository : Repository<Game>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filesService: FilesService
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

  async update(id: string, updateGameDto: UpdatePlayerDto): Promise<Player> {
      try {
        const player = await this.findOne(id);
  
        if (!player) {
          throw new NotFoundException(this.i18n.t('entities.player.notFound'));
        }
  
  
        const updatedData = {
          ...player,
          ...updateGameDto,
          id: player.id
        };
  
        const result = await this.playerRepository.save(updatedData, { reload: true });
  
        return result;
      } catch (error) {
        ExceptionBuilder.handleException(error, 'PlayerService');
      }
    }

  async remove(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      const result = await this.playerRepository.delete(id);
      return (result && result.affected && result.affected > 0) ? true : false;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }

  async getImage(id: string): Promise<string | false>{
    try {

      const player = await this.findOne(id);

      if(!player){
        throw new NotFoundException(this.i18n.t('entities.player.notFound'));
      }

      return this.filesService.getImage(player.game.id, player.id);

    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<boolean> {
    try {

      const player = await this.findOne(id);

      if(!player){
        throw new NotFoundException(this.i18n.t('entities.player.notFound'));
      }

      const { mimetype, buffer } = file;

      const result = await this.filesService.savePlayerImage(player.game.id, player.id, mimetype, buffer);

      if(result){
        await this.update(player.id, {avatarImg : true});
      }

      return result
    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }
}
