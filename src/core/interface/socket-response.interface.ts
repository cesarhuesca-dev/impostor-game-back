import { GameSocketTopic } from 'src/core/enum/game-topics.enum';

export interface SocketResponse {
  topic: GameSocketTopic;
  data: any[];
  success: boolean;
  error?: any;
}
