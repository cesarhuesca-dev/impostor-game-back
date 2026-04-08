import { PlayerDto } from "./player.dto";

export interface GameDto {
  id: string;
  roomName: string;
  roomPassword?: string;
  roomPlayers: number;
  customWords: boolean;
  specificCategory: boolean;
  category: string | null;
  multipleImpostors: boolean;
  overlay: boolean;
  gameStarted: boolean;
  showingImpostor: boolean;
  showingWord: boolean;
  roomPlayersJoined: number;
  round: number;
  word: string | null;
  players?: PlayerDto[]
}
