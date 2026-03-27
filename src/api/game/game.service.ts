import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseBuilder } from 'src/core/utils/response';
import { GameDto } from './dto/game.dto';
import { ExceptionBuilder } from 'src/core/utils/exception';

@Injectable()
export class GameService {
  private readonly logger = new Logger('GameService');

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  ) {}

  async findOne(id: string): Promise<Game> {
    try {
      const game = await this.gameRepository.findOneBy({ id });

      if (!game) {
        throw new NotFoundException(this.i18n.t('entities.game.notFound'));
      }

      return game;
    } catch (error) {
      ExceptionBuilder.handleException(error);
    }
  }

  async findOnePlain(id: string) {
    try {
      const game = await this.findOne(id);

      return ResponseBuilder.build<GameDto>(Game.toPlain(game));
    } catch (error) {
      ExceptionBuilder.handleException(error);
    }
  }

  async create(createGameDto: CreateGameDto) {
    try {
      const salt = await bcrypt.genSalt();

      createGameDto.roomPassword = await bcrypt.hash(createGameDto.roomPassword, salt);

      const existGame = await this.gameRepository.findOneBy({ roomName: createGameDto.roomName });

      if (existGame) {
        throw new BadRequestException(this.i18n.t('entities.game.alreadyExist'));
      }

      const game = this.gameRepository.create(createGameDto);

      await this.gameRepository.save(game);

      return ResponseBuilder.build<GameDto>(Game.toPlain(game));
    } catch (error) {
      ExceptionBuilder.handleException(error);
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    try {
      const game = await this.findOne(id);

      const salt = await bcrypt.genSalt();

      const updatedData = {
        ...game,
        ...updateGameDto,
        roomPassword: updateGameDto.roomPassword
          ? await bcrypt.hash(updateGameDto.roomPassword, salt)
          : game.roomPassword,
        id: game.id
      };

      await this.gameRepository.save(updatedData, { reload: true });

      return ResponseBuilder.build<GameDto>(Game.toPlain(updatedData));
    } catch (error) {
      ExceptionBuilder.handleException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.gameRepository.delete(id);
      return ResponseBuilder.buildSuccess();
    } catch (error) {
      ExceptionBuilder.handleException(error);
    }
  }
}
