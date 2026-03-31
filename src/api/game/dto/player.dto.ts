import { GameDto } from "src/api/game/dto/game.dto";

export interface PlayerDto {

  id: string;
  name: string;
  avatarImg?: boolean;
  
  game: GameDto

}
