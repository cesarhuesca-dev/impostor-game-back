import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerService } from './services/player.service';
import { JoinService } from './services/join.service';
import { GameService } from './services/game.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { FilesService } from 'src/common/services/files.service';
import { AuthService } from 'src/common/services/auth.service';

@Module({
  controllers: [GameController],
  imports: [
    TypeOrmModule.forFeature([Game, Player]),
    JwtModule,
    CommonModule
  ],
  providers: [
    GameService,
    PlayerService,
    JoinService,
    JwtService,
    AuthService,
    FilesService
  ],
  exports: [
    GameModule,
    TypeOrmModule,
    JwtModule
  ]
})
export class GameModule {}
