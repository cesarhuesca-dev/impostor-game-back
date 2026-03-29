import { GameDto } from "src/api/game/dto/game.dto";

export interface PlayerDto {

  name: string;
  avatarImg?: string;
  
  game: GameDto

}
