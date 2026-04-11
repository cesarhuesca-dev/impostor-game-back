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
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const token = client.client.request.headers.authorization ?? '';
    const tokenResult = this.authService.verifyJwtToken(token);

    if (!tokenResult) {
      return;
    }

    const { gameId, playerId } = tokenResult;

    this.gameSocketService.disconnectClient(gameId, playerId);
  }
}
