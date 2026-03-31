import { PlayerDto } from "./player.dto";

export interface JoinDto {
  player: PlayerDto
  token: string;
}
