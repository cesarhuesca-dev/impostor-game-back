import { GameSocketTopic } from 'src/core/enum/game-topics.enum';
import { SocketResponse } from '../interface/socket-response.interface';

export class SocketResponseBuilder {
  static build(topic: GameSocketTopic, data: any = [], success: boolean = true): string {
    const dataFormated = Array.isArray(data) ? data : [data];

    const obj: SocketResponse = {
      topic,
      data: dataFormated,
      success,
    };

    return JSON.stringify(obj);
  }
}
