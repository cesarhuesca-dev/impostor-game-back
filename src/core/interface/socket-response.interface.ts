import { GameSocketTopic } from 'src/websockets/enums/game-topics.enum';

export interface SocketResponse {
  topic: GameSocketTopic;
  data: any[];
  success: boolean;
  error?: any;
}
