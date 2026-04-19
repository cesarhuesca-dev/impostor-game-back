import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { PlayerService } from './player.service';
import { WordCategories } from 'src/common/enums/categories.enum';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filesService: FilesService,
    private readonly wordService: WordService,
    @Inject(forwardRef(() => PlayerService)) private readonly playerService: PlayerService,
  ) {}

  //#region CRUD METHODS

  async findOne(term: string): Promise<Game | null> {
    try {
      let game: Game | null = null;

      if (isUUID(term)) {
        game = await this.gameRepository.findOneBy({ id: term.trim() });
      } else {
        game = await this.gameRepository.findOneBy({ roomName: term.trim() });
      }

      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    try {
      if (
        createGameDto.specificCategory &&
        (!createGameDto.category || createGameDto.category.length === 0)
      ) {
        throw new BadRequestException(this.i18n.t('entities.game.categoryEmpty'));
      }

      const existGame = await this.findOne(createGameDto.roomName);

      if (existGame) {
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const salt = await bcrypt.genSalt();

      const game = this.gameRepository.create({
        ...createGameDto,
        roomPassword: await bcrypt.hash(createGameDto.roomPassword, salt),
        roomName: createGameDto.roomName.trim(),
      });

      await this.gameRepository.save(game);

      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
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
        roomName: updateGameDto.roomName ? updateGameDto.roomName.trim() : game.roomName,
        roomPassword: updateGameDto.roomPassword
          ? await bcrypt.hash(updateGameDto.roomPassword, salt)
          : game.roomPassword,
        id: game.id,
      };

      const result = await this.gameRepository.save(updatedData, { reload: true });

      return result;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async deleteGame(id: string): Promise<boolean> {
    try {
      const game = await this.findOne(id);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      await this.gameRepository.delete(id);
      this.filesService.deleteGameImages(id);
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
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

      if (!game || !isMatch)
        throw new BadRequestException(this.i18n.t('entities.game.invalidInputs'));

      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async startGame(gameId: string): Promise<Game> {
    try {
      const game = await this.updateGame(gameId, { gameStarted: true });
      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async endGame(gameId: string): Promise<Game> {
    try {
      const game = await this.updateGame(gameId, {
        gameStarted: false,
        round: 0,
        category: null,
        word: null,
      });
      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async newRound(gameId: string, word: string | null = null): Promise<Game> {
    try {
      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if (!game.gameStarted) {
        throw new BadRequestException(this.i18n.t('entities.game.notStarted'));
      }

      const i18nLang =
        (I18nContext.current<I18nTranslations>()?.lang as LanguagesSupported) ?? null;

      if (!i18nLang) {
        throw new BadRequestException(this.i18n.t('exceptions.notAcceptable'));
      }

      //Conseguir un nuevo impostor
      const multipleImpostors = game.multipleImpostors ? Math.random() < 0.05 : false;

      const impostor = await this.playerService.newRoundImpostor(gameId, multipleImpostors);

      if (!impostor) {
        throw new BadRequestException(this.i18n.t('entities.game.noImpostors'));
      }

      //Conseguir una palabra y categoria
      let category: WordCategories | null = null;

      if (!word) {
        category =
          game.specificCategory && game.category && game.category.length > 0
            ? WordCategories[game.category]
            : WordCategories.all;

        const randomWord = await this.wordService.getRandomWord(i18nLang, category!);

        if (!randomWord) {
          throw new BadRequestException(this.i18n.t('entities.game.noWord'));
        }

        word = randomWord.word;
      }

      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

      const updatedGame = await this.updateGame(gameId, {
        word: word,
        category: category,
        round: game.round + 1,
      });
      return updatedGame;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async changeWord(gameId: string, word: string | null = null): Promise<Game> {
    try {
      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      if (!game.gameStarted) {
        throw new BadRequestException(this.i18n.t('entities.game.notStarted'));
      }

      const i18nLang =
        (I18nContext.current<I18nTranslations>()?.lang as LanguagesSupported) ?? null;

      if (!i18nLang) {
        throw new BadRequestException(this.i18n.t('exceptions.notAcceptable'));
      }

      let category: WordCategories | null = null;

      if (!word) {
        category =
          game.specificCategory && game.category && game.category.length > 0
            ? WordCategories[game.category]
            : WordCategories.all;

        const randomWord = await this.wordService.getRandomWord(i18nLang, category!);

        if (!randomWord) {
          throw new BadRequestException(this.i18n.t('entities.game.noWord'));
        }

        word = randomWord.word;
      }

      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

      const updatedGame = await this.updateGame(gameId, { word: word, category: category });
      return updatedGame;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }

  async changeCategory(gameId: string, category: string): Promise<Game> {
    try {
      const game = await this.findOne(gameId);

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      const newCategory = WordCategories[category];

      if (!newCategory) {
        throw new NotFoundException(this.i18n.t('entities.game.categoryEmpty'));
      }

      const result = await this.updateGame(gameId, {
        specificCategory: true,
        category: newCategory,
      });

      return result;
    } catch (error) {
      ExceptionBuilder.handleException(error, GameService.name);
    }
  }
}
