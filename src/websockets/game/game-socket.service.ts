import { Injectable } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/core/interface/jwt.interface';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { GameSocketTopic } from '../enums/game-topics.enum';
import { Game } from 'src/api/game/entities';
import { GameService, PlayerService } from 'src/api/game/services';
import { SocketResponseBuilder } from 'src/core/utils/socket-response';

interface ConnectedRooms {
  [id: string]: ConnectedClients[]
}

interface ConnectedClients {
  socket : Socket,
  idPlayer: string
}


@Injectable()
export class GameSocketService {

  private server!: Server;
  private rooms : ConnectedRooms = {};

  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ){
    
  }

  setServer(server: Server) {
    this.server = server;
  }

  emitToRoom(room: string, event: GameSocketTopic, data: string) {
    this.server.to(room).emit(event, data);
  }

  registerClient(idGame : string, idPlayer: string, client: Socket){

    const i18n = I18nContext.current<I18nTranslations>();
    
    const room = this.existRoom(idGame);

    if(room){
      
      const player = this.existPlayer(this.rooms[room], idPlayer);

      if(player){
        throw new Error(i18n?.t('entities.player.notFound'));
      }

      this.addClient(idGame, idPlayer, client);
      return;
    }

    
    this.createRoom(idGame);
    this.addClient(idGame, idPlayer, client);
  }

  disconnectClient(idGame : string, idPlayer: string) {
    this.removeClient(idGame, idPlayer);
  }

  createRoom(idGame: string){
    this.rooms[idGame] = [];
  }

  addClient(idGame : string, idPlayer: string, socket: Socket){
    this.rooms[idGame].push({
      idPlayer,
      socket
    });
  }

  removeClient(idGame : string, idPlayer: string){

    const i18n = I18nContext.current<I18nTranslations>();
    
    const room = this.existRoom(idGame);

    if(!room){
      throw new Error(i18n?.t('entities.player.notFound'))
    }

    const player = this.existPlayer(this.rooms[room], idPlayer)

    if(!player){
      throw new Error(i18n?.t('entities.player.notFound'))
    }

    player.socket.disconnect();
    this.rooms[room] = this.rooms[room].filter(clients => clients.idPlayer !== idPlayer);
  }

  existRoom(idGame : string): string | null {
    const game = Object.keys(this.rooms).find((roomId) => idGame === roomId) ?? null;
    return game;
  }

  existPlayer(room : ConnectedClients[], idPlayer: string): ConnectedClients | null{
    const player = room.find(clients => clients.idPlayer === idPlayer) ?? null;
    return player;
  }

  getRoomClients(gameId:string): string[] {
    const room = this.existRoom(gameId);
    const clients = (room) ? this.rooms[room].map(x => x.idPlayer) : []
    return clients;
  }

  async updatePlayersList(idGame: string){
    const game = await this.gameService.findOne(idGame);
    const players = await this.playerService.findPlayersByGame(idGame);

    this.emitToRoom(
      idGame,
      GameSocketTopic.PLAYER_MESSAGE,
      SocketResponseBuilder.build(GameSocketTopic.CLIENTS_LIST_UPDATED, Game.toPlain(game!, players))
    );
  }
}
