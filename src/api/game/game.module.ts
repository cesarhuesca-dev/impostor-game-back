import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [TypeOrmModule.forFeature([Game])],
  exports: [GameModule, TypeOrmModule]
})
export class GameModule {}
