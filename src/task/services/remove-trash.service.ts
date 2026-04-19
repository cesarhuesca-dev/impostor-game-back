import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/api/game/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RemoveTrashService {
  private readonly logger = new Logger(RemoveTrashService.name);

  constructor(@InjectRepository(Game) private readonly game: Repository<Game>) {}

  // @Interval(10 * 1000)
  @Cron(CronExpression.EVERY_HOUR)
  async removeTrash() {
    try {
      // Fecha de hace 3 horas
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

      const result = await this.game
        .createQueryBuilder()
        .delete()
        .where('updatedAt < :date', { date: threeHoursAgo })
        .execute();

      if (result.affected && result.affected > 0) {
        this.logger.debug(`Removed ${result.affected} old games`);
      } else {
        this.logger.debug('No old games to remove');
      }
    } catch (error) {
      this.logger.error('Error removing trash', error);
    }
  }
}
