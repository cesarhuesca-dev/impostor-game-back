import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { GameSocketTopic } from '../../core/enum/game-topics.enum';
import { Game, Player } from 'src/api/game/entities';
import { SocketResponseBuilder } from 'src/core/utils/socket-response';
import { GameService } from 'src/api/game/services/game.service';
import { PlayerService } from 'src/api/game/services/player.service';
import { ExceptionWsBuilder } from 'src/core/utils/exception-ws';

interface ConnectedRooms {
  [id: string]: ConnectedClients[];
}

interface ConnectedClients {
  socket: Socket;
  idPlayer: string;
}

@Injectable()
export class GameSocketService {
  private server!: Server;
  private rooms: ConnectedRooms = {};

  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  emitToRoom(room: string, event: GameSocketTopic, data: string) {
    this.server.to(room).emit(event, data);
  }

  registerClient(idGame: string, idPlayer: string, client: Socket) {
    const i18n = I18nContext.current<I18nTranslations>();

    const room = this.existRoom(idGame);

    if (room) {
      const player = this.existPlayer(this.rooms[room], idPlayer);

      if (player) {
        throw new Error(i18n?.t('entities.player.found'));
      }

      this.addClient(idGame, idPlayer, client);
      return;
    }

    this.createRoom(idGame);
    this.addClient(idGame, idPlayer, client);
  }

  disconnectClient(idGame: string, idPlayer: string) {
    this.removeClient(idGame, idPlayer);
  }

  createRoom(idGame: string) {
    this.rooms[idGame] = [];
  }

  addClient(idGame: string, idPlayer: string, socket: Socket) {
    this.rooms[idGame].push({
      idPlayer,
      socket,
    });
  }

  removeClient(idGame: string, idPlayer: string) {
    const i18n = I18nContext.current<I18nTranslations>();

    const room = this.existRoom(idGame);

    if (!room) {
      throw new Error(i18n?.t('exceptions.websockets.room-not-found'));
    }

    const player = this.existPlayer(this.rooms[room], idPlayer);

    if (!player) {
      throw new Error(i18n?.t('exceptions.websockets.user-not-found'));
    }

    player.socket.disconnect();
    this.rooms[room] = this.rooms[room].filter((clients) => clients.idPlayer !== idPlayer);
  }

  existRoom(idGame: string): string | null {
    const game = Object.keys(this.rooms).find((roomId) => idGame === roomId) ?? null;
    return game;
  }

  existPlayer(room: ConnectedClients[], idPlayer: string): ConnectedClients | null {
    const player = room.find((clients) => clients.idPlayer === idPlayer) ?? null;
    return player;
  }

  getRoomClients(gameId: string): string[] {
    const room = this.existRoom(gameId);
    const clients = room ? this.rooms[room].map((x) => x.idPlayer) : [];
    return clients;
  }

  async emitGameStatus(idGame: string, newRound = false) {
    try {
      const i18n = I18nContext.current<I18nTranslations>();

      const game = await this.gameService.findOne(idGame);

      if (!game) {
        throw new Error(i18n?.t('entities.game.notFound'));
      }

      const players = await this.playerService.findPlayersByGame(idGame);

      this.emitToRoom(
        idGame,
        GameSocketTopic.PLAYER_MESSAGE,
        SocketResponseBuilder.build(
          newRound ? GameSocketTopic.NEW_ROUND_GAME : GameSocketTopic.UPDATE_GAME_STATUS,
          Game.toPlain(
            game!,
            players.map((x) => Player.toPlain(x, false)),
          ),
        ),
      );
    } catch (error) {
      ExceptionWsBuilder.handleException(error);
    }
  }

  async emitPlayerStatus(playerId: string) {
    try {
      const i18n = I18nContext.current<I18nTranslations>();

      const player = await this.playerService.findOne(playerId);

      if (!player) {
        throw new Error(i18n?.t('entities.player.notFound'));
      }

      this.emitToRoom(
        player.game.id,
        GameSocketTopic.PLAYER_MESSAGE,
        SocketResponseBuilder.build(GameSocketTopic.UPDATE_PLAYER_STATUS, Player.toPlain(player)),
      );
    } catch (error) {
      ExceptionWsBuilder.handleException(error);
    }
  }

  async emitPlayerBanned(idGame: string, idPlayer: string) {
    try {
      this.emitToRoom(
        idGame,
        GameSocketTopic.PLAYER_MESSAGE,
        SocketResponseBuilder.build(GameSocketTopic.PLAYER_ELIMINATED, idPlayer),
      );
    } catch (error) {
      ExceptionWsBuilder.handleException(error);
    }
  }

  async emitCloseGame(idGame: string) {
    try {
      const players = await this.playerService.findHostGame(idGame);

      if (players.length === 0) {
        this.emitToRoom(
          idGame,
          GameSocketTopic.PLAYER_MESSAGE,
          SocketResponseBuilder.build(GameSocketTopic.CLOSE_GAME),
        );
      }
    } catch (error) {
      ExceptionWsBuilder.handleException(error);
    }
  }
}
