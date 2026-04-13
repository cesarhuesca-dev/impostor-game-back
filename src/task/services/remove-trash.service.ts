import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/api/game/entities';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class RemoveTrashService {
  private readonly logger = new Logger(RemoveTrashService.name);

  constructor(@InjectRepository(Game) private readonly game: Repository<Game>) {}

  // @Interval(10 * 1000)
  @Cron(CronExpression.EVERY_HOUR)
  async removeTrash() {
    try {
      // BORRADOS CADA 3 HORAS
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

      const oldGames = await this.game.find({
        where: {
          updatedAt: LessThan(threeHoursAgo),
        },
      });

      if (oldGames.length > 0) {
        await this.game.remove(oldGames);
        this.logger.debug(`Removed ${oldGames.length} old games`);
      } else {
        this.logger.debug('No old games to remove');
      }
    } catch (error) {
      this.logger.error('Error removing trash', error);
    }
  }
}
