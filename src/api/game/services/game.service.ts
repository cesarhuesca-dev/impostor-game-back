import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { CreateGameDto, UpdateGameDto } from '../dto';
import { Game } from '../entities';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/common/services/files.service';


@Injectable()
export class GameService {

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly filesService: FilesService,
  ) {}

  //#region CRUD METHODS

  async findOne(term: string): Promise<Game | null> {
    try {

      let game: Game | null = null;

      if(isUUID(term)){
        game = await this.gameRepository.findOneBy({ id : term.trim() });
      }else{
        game = await this.gameRepository.findOneBy({ roomName: term.trim() });
      }

      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    try {
      const salt = await bcrypt.genSalt();

      createGameDto.roomPassword = await bcrypt.hash(createGameDto.roomPassword, salt);

      const existGame = await this.gameRepository.findOneBy({ roomName: createGameDto.roomName });

      if (existGame) {
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const game = this.gameRepository.create(createGameDto);

      await this.gameRepository.save(game);

      return game;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async updateGame(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    try {
      const game = await this.findOne(id);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      const salt = await bcrypt.genSalt();

      const updatedData = {
        ...game,
        ...updateGameDto,
        roomPassword: updateGameDto.roomPassword
          ? await bcrypt.hash(updateGameDto.roomPassword, salt)
          : game.roomPassword,
        id: game.id
      };

      const result = await this.gameRepository.save(updatedData, { reload: true });

      return result;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async deleteGame(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      await this.gameRepository.delete(id);
      this.filesService.deleteGameImages(id);
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  //#endregion

  async verifyJoinGame(roomName: string, roomPassword: string): Promise<boolean> {
    try {
    
      const game = await this.findOne(roomName);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      const isMatch = await bcrypt.compare(roomPassword, game.roomPassword);

      if(!game || !isMatch) throw new BadRequestException(this.i18n.t('entities.game.invalidInputs'));
      if(game.roomPlayersJoined >= game.roomPlayers) throw new UnauthorizedException(this.i18n.t('entities.game.fullGameRoom'))

      return true;

    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  

  async startGame(gameId: string): Promise<boolean>{
    try {
      await this.updateGame(gameId, { gameStarted: true });
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async endGame(gameId: string): Promise<boolean>{
    try {
      await this.updateGame(gameId, { gameStarted: false, round: 0 });
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async newRound(gameId: string){
    try {

      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if(!game.gameStarted){
        throw new BadRequestException(this.i18n.t('entities.game.notStarted'));
      }

      //!TODO METER LA PALABRA NUEVA

      await this.updateGame(gameId, { round: game.round + 1 });
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  

  

  
}
