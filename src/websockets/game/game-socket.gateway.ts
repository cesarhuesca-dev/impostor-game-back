import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSocketService } from './game-socket.service';
import { AuthService } from 'src/common/services/auth.service';
import { ExceptionWsBuilder } from 'src/core/utils/exception-ws';

@WebSocketGateway({ cors: true, namespace: '/game' })
export class GameSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly gameSocketService: GameSocketService,
    private readonly authService: AuthService,
  ) {}

  afterInit() {
    this.gameSocketService.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.client.request.headers.authorization ?? '';

      const tokenResult = this.authService.verifyJwtToken(token);

      if (!tokenResult) {
        return;
      }

      const { gameId, playerId } = tokenResult;

      await client.join(gameId);
      this.gameSocketService.registerClient(gameId, playerId, client);
      await this.gameSocketService.emitGameStatus(gameId);
    } catch (error) {
      client.disconnect();
      ExceptionWsBuilder.handleException(error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const token = client.client.request.headers.authorization ?? '';
      const tokenResult = this.authService.verifyJwtToken(token);

      if (!tokenResult) {
        return;
      }

      const { gameId, playerId } = tokenResult;

      this.gameSocketService.disconnectClient(gameId, playerId);
    } catch (error) {
      ExceptionWsBuilder.handleException(error);
    }
  }
}
