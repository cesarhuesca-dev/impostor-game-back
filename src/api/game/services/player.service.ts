import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { FilesService } from 'src/common/services/files.service';
import { Game, Player } from '../entities';
import { UpdatePlayerDto } from '../dto';
import { GameService } from './game.service';

@Injectable()
export class PlayerService {
  
  constructor(
    @InjectRepository(Player) private readonly playerRepository : Repository<Player>,
    @InjectRepository(Game) private readonly gameRepository : Repository<Game>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filesService: FilesService,
    private readonly gameService: GameService
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

  async findPlayersByGame(idGame: string): Promise<Player[]> {
    try {
      
      const players = await this.playerRepository.find({
        where : {game : { id : idGame }}
      });

      return players;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }
  
  async createPlayer(playerName: string, gameId: string, host: boolean): Promise<Player>{

    try {

      const exist = await this.findOne(playerName)

      if(exist){
        throw new BadRequestException(this.i18n.t('entities.player.alreadyExist'));
      }

      const objCreate = this.playerRepository.create({
        name: playerName.trim(),
        host: host,
        game: await this.gameRepository.preload({id: gameId})
      })

      const player = await this.playerRepository.save(objCreate);

      return player;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }

  }

  async updatePlayer(id: string, updateGameDto: UpdatePlayerDto): Promise<Player> {
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

  async deletePlayer(id: string): Promise<boolean> {
    try {
      const player = await this.findOne(id);
      
      if(!player){
        throw new NotFoundException(this.i18n.t('entities.player.notFound'));
      }

      const idGame = player.game.id;
      const roomPlayersJoined = player.game.roomPlayersJoined - 1;
      let result: DeleteResult;

      if(player.host){
        //Si es host hay que eliminar a todos lo jugadores y el juego
        result = await this.playerRepository.delete({game : { id: idGame }});
        await this.gameService.deleteGame(idGame);
        this.filesService.deleteGameImages(idGame)
      }else{
        //Si no es host solo hay que eliminar 1 y actualizar el juego
        await this.gameService.updateGame(idGame, { roomPlayersJoined });
        result = await this.playerRepository.delete(id);
        this.filesService.deleteImage(player.id, idGame)
      }

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
        await this.updatePlayer(player.id, {avatarImg : true});
      }

      return result
    } catch (error) {
      ExceptionBuilder.handleException(error, 'PlayerService');
    }
  }
}
