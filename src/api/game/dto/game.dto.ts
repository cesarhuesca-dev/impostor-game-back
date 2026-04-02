import { PlayerDto } from "./player.dto";

export interface GameDto {
  id: string;
  roomName: string;
  roomPassword?: string;
  roomPlayers: number;
  customWords: boolean;
  specificCategory: boolean;
  category: string;
  multipleImpostors: boolean;
  overlay: boolean;
  gameStarted: boolean;
  showingImpostor: boolean;
  showingWord: boolean;
  roomPlayersJoined: number;
  round: number;
  players?: PlayerDto[]
}
