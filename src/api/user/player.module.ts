import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { GameModule } from '../game/game.module';
import { GameService } from '../game/game.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, GameService],
  imports: [TypeOrmModule.forFeature([Player]), GameModule],
  exports : [PlayerModule, TypeOrmModule]
})
export class PlayerModule {}
