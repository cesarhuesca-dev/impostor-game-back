import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { CreateGameDto, UpdateGameDto } from '../dto';
import { Game } from '../entities';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/common/services/files.service';
import { WordService } from 'src/common/services/word.service';
import { LanguagesSupported } from 'src/core/enum/languages.enum';
import { Word } from 'src/common/interfaces/word.interface';
import { PlayerService } from './player.service';


@Injectable()
export class GameService {

  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filesService: FilesService,
    private readonly wordService: WordService,
    @Inject(forwardRef(() => PlayerService)) private readonly playerService: PlayerService
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

  

  async startGame(gameId: string): Promise<Game>{
    try {
      const game = await this.updateGame(gameId, { gameStarted: true });
      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async endGame(gameId: string): Promise<boolean>{
    try {
      await this.updateGame(gameId, { gameStarted: false, round: 0, category: null, word: null });
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async newRound(gameId: string): Promise<Word>{
    try {

      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if(!game.gameStarted){
        throw new BadRequestException(this.i18n.t('entities.game.notStarted'));
      }

      const i18nLang = I18nContext.current<I18nTranslations>()?.lang as LanguagesSupported ?? null;

      if(!i18nLang){
        throw new BadRequestException(this.i18n.t('exceptions.notAcceptable'));
      }

      const word = await this.wordService.getRandomWord(i18nLang);

      if(!word){
        throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
      }

      await this.updateGame(gameId, { round: game.round + 1, word: word.word, category: word.category });

      const impostor = await this.playerService.newRoundImpostor(gameId);

      if(!impostor) {
        throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
      }

      return word;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  async changeWord(gameId: string): Promise<Word>{
    try {

      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if(!game.gameStarted){
        throw new BadRequestException(this.i18n.t('entities.game.notStarted'));
      }

      const i18nLang = I18nContext.current<I18nTranslations>()?.lang as LanguagesSupported ?? null;

      if(!i18nLang){
        throw new BadRequestException(this.i18n.t('exceptions.notAcceptable'));
      }

      const word = await this.wordService.getRandomWord(i18nLang);

      if(!word){
        throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
      }

      await this.updateGame(gameId, { word: word.word, category: word.category });

      return word;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'GameService');
    }
  }

  

  
}
