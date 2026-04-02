import { Module } from '@nestjs/common';
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
import { GameController } from './controllers/game.controller';
import { GamePlayerController } from './controllers/player.controller';
import { GameJoinController } from './controllers/join.controller';
import { JwtStrategy } from '../../common/strategies/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/core/config';

@Module({
  controllers: [
    GameController,
    GamePlayerController,
    GameJoinController,
  ],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Game, Player]),
    JwtModule,
    PassportModule.registerAsync(passportOptions),
    JwtModule.registerAsync(jwtOptions),
  ],
  providers: [
    GameService,
    PlayerService,
    JoinService,
    JwtService,
    AuthService,
    FilesService,
    JwtStrategy
  ],
  exports: [
    GameModule,
    TypeOrmModule,
    JwtModule,
    PassportModule,
    JwtModule
  ]
})
export class GameModule {}
